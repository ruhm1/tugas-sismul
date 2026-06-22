import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { GoogleGenAI } from '@google/genai';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY',
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }
  return aiClient;
}

// POST /api/chat - public
const responseCache = new Map<string, {text: string, expiry: number}>();

router.post('/', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  const apiKey = process.env.GEMINI_API_KEY;

  // Fetch knowledge base from Firestore
  const knowledgeSnap = await db.collection('chatbot_knowledge').where('isActive', '==', true).get();
  const knowledge = knowledgeSnap.docs.map(d => d.data());

  const fallbackLogic = () => {
    const match = knowledge.find((k: any) => {
      const q = k.question?.toLowerCase();
      if (q && message.toLowerCase().includes(q)) return true;
      const keywords = q?.split(' ').filter((w: string) => w.length > 3) || [];
      return keywords.some((w: string) => message.toLowerCase().includes(w));
    });
    
    if (match) {
      return res.json({ text: (match as any).answer });
    }

    return res.json({
      text: 'Salam hangat dari GOURMET. Saya adalah AI Sommelier Anda. Saya dapat membantu dengan menu, reservasi, atau panduan alergi.',
    });
  };

  // 1. Coba pencocokan ketat dari Knowledge Base DAHULU sebelum memanggil AI
  // Ini menghemat kuota untuk pertanyaan yang sudah ada di database (FAQ)
  const exactMatch = knowledge.find((k: any) => 
    k.question && message.toLowerCase().includes(k.question.toLowerCase())
  );
  if (exactMatch) {
    return res.json({ text: (exactMatch as any).answer });
  }

  // 2. Cek Cache In-Memory
  const cacheKey = message.toLowerCase().trim();
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return res.json({ text: cached.text });
  }

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return fallbackLogic();
  }

  try {
    const knowledgeContext = knowledge.map((k: any) => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n');

    const ai = getGemini();
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: `You are the AI Sommelier and Maître d' of GOURMET restaurant.\nUse this knowledge base:\n${knowledgeContext}\nKeep responses concise and elegant.`,
        temperature: 0.8,
      },
    });

    const response = await chat.sendMessage({ message });
    const replyText = response.text || 'I am at your service.';
    
    // Simpan ke cache selama 1 jam (3600000 ms) untuk menghemat kuota jika ditanya hal yang sama
    responseCache.set(cacheKey, { text: replyText, expiry: Date.now() + 3600000 });
    
    // Bersihkan cache jika terlalu besar (lebih dari 100 item)
    if (responseCache.size > 100) {
      const firstKey = responseCache.keys().next().value;
      if (firstKey) responseCache.delete(firstKey);
    }

    res.json({ text: replyText });
  } catch (err: any) {
    console.error('AI Error:', err.message, '- Falling back to knowledge base');
    return fallbackLogic();
  }
});

// GET /api/chatbot/knowledge - protected
router.get('/knowledge', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const snap = await db.collection('chatbot_knowledge').get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chatbot/knowledge - protected
router.post('/knowledge', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, category } = req.body;
    const data = {
      question,
      answer,
      category: category || 'general',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await db.collection('chatbot_knowledge').add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/chatbot/knowledge/:id - protected
router.delete('/knowledge/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await db.collection('chatbot_knowledge').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
