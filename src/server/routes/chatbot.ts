import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
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
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Fallback responses
    const knowledge = await prisma.chatbotKnowledge.findMany({ where: { isActive: true } });
    const match = knowledge.find((k) =>
      message.toLowerCase().includes(k.question.toLowerCase().slice(0, 30))
    );
    if (match) return res.json({ text: match.answer });

    return res.json({
      text: 'Welcome to GOURMET. I am your AI Sommelier. Ask me about our menu, reservations, or wine pairings.',
    });
  }

  try {
    const knowledge = await prisma.chatbotKnowledge.findMany({ where: { isActive: true } });
    const knowledgeContext = knowledge.map((k) => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n');

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
    const items = await prisma.chatbotKnowledge.findMany({ orderBy: { category: 'asc' } });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chatbot/knowledge - protected
router.post('/knowledge', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, category } = req.body;
    const item = await prisma.chatbotKnowledge.create({
      data: { question, answer, category: category || 'general' },
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/chatbot/knowledge/:id - protected
router.delete('/knowledge/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.chatbotKnowledge.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
