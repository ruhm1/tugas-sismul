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
router.post('/', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  const apiKey = process.env.GEMINI_API_KEY;

  // Fetch knowledge base from Firestore
  const knowledgeSnap = await db.collection('chatbot_knowledge').where('isActive', '==', true).get();
  const knowledge = knowledgeSnap.docs.map(d => d.data());

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Fallback responses from knowledge base
    const match = knowledge.find((k: any) =>
      message.toLowerCase().includes(k.question?.toLowerCase().slice(0, 30))
    );
    if (match) return res.json({ text: (match as any).answer });

    return res.json({
      text: 'Welcome to GOURMET. I am your AI Sommelier. Ask me about our menu, reservations, or wine pairings.',
    });
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
    res.json({ text: response.text || 'I am at your service.' });
  } catch (err: any) {
    res.status(500).json({ error: 'AI error: ' + err.message });
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
