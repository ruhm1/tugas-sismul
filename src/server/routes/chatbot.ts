import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { GoogleGenAI } from '@google/genai';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const PLACEHOLDER_API_KEYS = new Set([
  'mock_key',
  'my_gemini_api_key',
  'isi_api_key_lu',
  'isi_api_key_asli',
]);

let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || PLACEHOLDER_API_KEYS.has(apiKey.toLowerCase())) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }
  return aiClient;
}

// POST /api/chat - public
type ChatSource =
  | 'menu_database'
  | 'menu_empty'
  | 'knowledge_exact'
  | 'knowledge_fallback'
  | 'gemini'
  | 'fallback_default'
  | 'fallback_api_key_missing'
  | 'fallback_gemini_error'
  | 'cache';

type CachedResponse = { text: string; source: ChatSource; expiry: number };

const responseCache = new Map<string, CachedResponse>();

const STOP_WORDS = new Set([
  'apa', 'ada', 'saja', 'aja', 'yang', 'dan', 'atau', 'untuk', 'dengan',
  'apakah', 'bisa', 'kami', 'anda', 'saya', 'aku', 'kamu', 'mohon',
  'menu', 'makanan', 'hidangan', 'restoran', 'daftar', 'list',
  'the', 'and', 'with', 'your', 'you', 'our', 'are', 'can', 'what',
  'where', 'when', 'from', 'that', 'this', 'please',
]);

const DEFAULT_FALLBACK_TEXT =
  'Mohon maaf, AI Sommelier sedang tidak dapat diakses. Untuk sementara, saya dapat membantu informasi dasar seputar menu, reservasi, dan alergi berdasarkan data GOURMET.';

const ENGLISH_KNOWLEDGE_TRANSLATIONS: Array<{ pattern: RegExp; answer: string }> = [
  {
    pattern: /we take all allergies very seriously/i,
    answer:
      'Tentu. Kami menangani alergi dengan sangat serius. Mohon informasikan kebutuhan alergi atau pantangan makanan saat reservasi agar tim kuliner kami dapat menyiapkan menu alternatif yang aman, elegan, dan tetap sesuai standar GOURMET.',
  },
  {
    pattern: /open wednesday through sunday/i,
    answer:
      'GOURMET buka Rabu hingga Minggu pukul 17.00-23.30. Kami tutup setiap Senin dan Selasa. Pemesanan Executive Cellar memerlukan konfirmasi minimal 48 jam sebelumnya.',
  },
  {
    pattern: /located at 12 rue de la gastronomie/i,
    answer:
      'GOURMET berlokasi di 12 Rue de la Gastronomie, Paris 75008, Prancis. Kami menyediakan layanan valet parking untuk tamu makan malam.',
  },
  {
    pattern: /smart elegant dress code/i,
    answer:
      'Kami menerapkan dress code smart elegant. Tamu pria disarankan mengenakan jaket, dan kami mohon untuk tidak mengenakan pakaian olahraga, celana pendek, atau sandal jepit.',
  },
];

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u00c0-\u024f]+/i)
    .map(word => word.trim())
    .filter(word => word.length > 3 && !STOP_WORDS.has(word));
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function getKnowledgeText(item: any, includeAnswer = false): string {
  const keywords = Array.isArray(item.keywords) ? item.keywords.join(' ') : '';
  const base = `${item.question || ''} ${keywords} ${item.category || ''}`;
  return includeAnswer ? `${base} ${item.answer || ''}` : base;
}

function scoreKnowledgeItem(item: any, messageTokens: string[], includeAnswer = false): number {
  const knowledgeTokens = Array.from(new Set(tokenize(getKnowledgeText(item, includeAnswer))));
  if (messageTokens.length === 0 || knowledgeTokens.length === 0) return 0;

  const messageTokenSet = new Set(messageTokens);
  const matchedCount = knowledgeTokens.filter(token => messageTokenSet.has(token)).length;
  const precision = matchedCount / messageTokens.length;
  const coverage = matchedCount / knowledgeTokens.length;

  return (precision * 0.7) + (coverage * 0.3);
}

function getScoredKnowledge(knowledge: any[], message: string, includeAnswer = false) {
  const messageTokens = Array.from(new Set(tokenize(message)));
  if (messageTokens.length === 0) return [];

  return knowledge
    .map(item => ({ item, score: scoreKnowledgeItem(item, messageTokens, includeAnswer) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}

function findBestKnowledgeMatch(knowledge: any[], message: string) {
  const normalizedMessage = normalizeText(message);

  const exactMatch = knowledge.find((item) => {
    const question = normalizeText(String(item.question || ''));
    return question && question === normalizedMessage;
  });
  if (exactMatch) return { item: exactMatch, source: 'knowledge_exact' as ChatSource };

  const [questionMatch] = getScoredKnowledge(knowledge, message, false);
  if (questionMatch && questionMatch.score >= 0.6) {
    return { item: questionMatch.item, source: 'knowledge_fallback' as ChatSource };
  }

  const [answerMatch] = getScoredKnowledge(knowledge, message, true);
  if (answerMatch && answerMatch.score >= 0.55) {
    return { item: answerMatch.item, source: 'knowledge_fallback' as ChatSource };
  }

  return null;
}

function getRelevantKnowledge(knowledge: any[], message: string, limit = 5) {
  return getScoredKnowledge(knowledge, message, true)
    .filter(({ score }) => score >= 0.25)
    .map(({ item }) => item)
    .slice(0, limit);
}

function ensureIndonesianAnswer(answer: string): string {
  const knownTranslation = ENGLISH_KNOWLEDGE_TRANSLATIONS.find(({ pattern }) => pattern.test(answer));
  return knownTranslation?.answer || answer;
}

function isMenuQuestion(message: string): boolean {
  const text = normalizeText(message);
  const directMenuPhrases = [
    'ada menu',
    'menu apa',
    'list menu',
    'daftar menu',
    'apa saja menunya',
    'apa aja menunya',
    'makanan apa',
    'hidangan apa',
  ];

  return directMenuPhrases.some(phrase => text.includes(phrase))
    || /^(menu|makanan|hidangan)\s*(apa|apa saja|apa aja)?$/.test(text);
}

function isDietaryQuestion(message: string): boolean {
  const text = normalizeText(message);
  return [
    'gluten',
    'bebas gluten',
    'alergi',
    'allergy',
    'allergies',
    'dairy',
    'shellfish',
    'kacang',
    'kontaminasi',
    'celiac',
  ].some(keyword => text.includes(keyword));
}

function formatPrice(price: unknown): string {
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) && numericPrice > 0
    ? ` - $${numericPrice.toLocaleString('id-ID')}`
    : '';
}

async function getMenuDatabaseResponse() {
  const menuSnap = await db.collection('menus').where('isAvailable', '==', true).get();
  const seenMenus = new Set<string>();
  const menus = menuSnap.docs
    .map(d => d.data())
    .filter((menu: any) => {
      const key = `${menu.name || menu.title || ''}|${menu.category || ''}|${menu.price || ''}`;
      if (seenMenus.has(key)) return false;
      seenMenus.add(key);
      return true;
    });

  if (menus.length === 0) {
    return {
      text: 'Mohon maaf, daftar menu belum tersedia saat ini. Silakan hubungi tim GOURMET untuk informasi menu terbaru.',
      source: 'menu_empty' as ChatSource,
    };
  }

  const menuText = menus
    .slice(0, 10)
    .map((menu: any) => {
      const category = menu.category ? ` (${menu.category})` : '';
      return `- ${menu.name || menu.title || 'Menu GOURMET'}${category}${formatPrice(menu.price)}`;
    })
    .join('\n');

  return {
    text: `Berikut beberapa menu yang tersedia di GOURMET:\n${menuText}`,
    source: 'menu_database' as ChatSource,
  };
}

async function getDietaryMenuResponse(message: string) {
  if (!isDietaryQuestion(message)) return null;

  const menuSnap = await db.collection('menus').where('isAvailable', '==', true).get();
  const menus = menuSnap.docs.map(d => d.data());
  const messageTokens = new Set(tokenize(message));

  const matchedMenu = menus.find((menu: any) => {
    const menuTokens = tokenize(`${menu.name || ''} ${menu.description || ''} ${(menu.tags || []).join(' ')}`);
    return menuTokens.some(token => messageTokens.has(token));
  });

  if (!matchedMenu) {
    return {
      text: 'Tentu. Mohon informasikan alergi atau pantangan makanan saat reservasi agar tim kuliner GOURMET dapat menyiapkan hidangan yang aman dan tetap sesuai standar fine dining kami.',
      source: 'knowledge_fallback' as ChatSource,
    };
  }

  const tags = Array.isArray((matchedMenu as any).tags) ? (matchedMenu as any).tags : [];
  const hasGlutenFreeTag = tags.some((tag: string) => /^(gf|gluten[-\s]?free|bebas gluten)$/i.test(String(tag)));
  const menuName = (matchedMenu as any).name || 'hidangan tersebut';

  if (normalizeText(message).includes('gluten')) {
    const glutenStatus = hasGlutenFreeTag
      ? `${menuName} ditandai sebagai opsi bebas gluten di data menu kami.`
      : `${menuName} dapat kami cek dan sesuaikan untuk kebutuhan bebas gluten.`;

    return {
      text: `${glutenStatus} Mohon tetap informasikan kebutuhan bebas gluten saat reservasi agar tim dapur memastikan bahan dan proses penyajiannya aman dari risiko kontaminasi silang.`,
      source: 'knowledge_fallback' as ChatSource,
    };
  }

  return {
    text: `${menuName} dapat kami tinjau untuk kebutuhan alergi atau pantangan makanan Anda. Mohon informasikan detailnya saat reservasi agar tim dapur menyiapkan alternatif yang aman dan elegan.`,
    source: 'knowledge_fallback' as ChatSource,
  };
}

router.post('/', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  const normalizedMessage = String(message).trim();
  if (!normalizedMessage) return res.status(400).json({ error: 'Message is required.' });

  const jsonResponse = (text: string, source: ChatSource) => res.json({ text, source });

  try {
    // Fetch knowledge base from Firestore
    const knowledgeSnap = await db.collection('chatbot_knowledge').where('isActive', '==', true).get();
    const knowledge = knowledgeSnap.docs.map(d => d.data());

    // 1. Pertanyaan daftar menu harus memakai database menu, bukan FAQ/knowledge.
    if (isMenuQuestion(normalizedMessage)) {
      const menuResponse = await getMenuDatabaseResponse();
      return jsonResponse(menuResponse.text, menuResponse.source);
    }

    const dietaryMenuResponse = await getDietaryMenuResponse(normalizedMessage);
    if (dietaryMenuResponse) {
      return jsonResponse(dietaryMenuResponse.text, dietaryMenuResponse.source);
    }

    // 2. Cek Cache In-Memory
    const cacheKey = normalizedMessage.toLowerCase();
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return jsonResponse(cached.text, 'cache');
    }

    // 3. Coba Knowledge Base hanya jika relevansinya kuat.
    const knowledgeMatch = findBestKnowledgeMatch(knowledge, normalizedMessage);
    if (knowledgeMatch?.item?.answer) {
      return jsonResponse(ensureIndonesianAnswer(String(knowledgeMatch.item.answer)), knowledgeMatch.source);
    }

    const selectedKnowledge = getRelevantKnowledge(knowledge, normalizedMessage);
    const knowledgeContext = selectedKnowledge
      .map((k: any) => `Q: ${k.question}\nA: ${ensureIndonesianAnswer(String(k.answer || ''))}`)
      .join('\n\n');

    const ai = getGemini();
    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: `Anda adalah AI Sommelier dan Maître d' restoran GOURMET.

Aturan wajib:
- Selalu jawab dalam Bahasa Indonesia.
- Jangan menjawab dalam Bahasa Inggris.
- Jika knowledge base berbahasa Inggris, terjemahkan dan rapikan ke Bahasa Indonesia.
- Gaya bahasa elegan, ramah, singkat, sesuai restoran fine dining.
- Jangan mengarang fakta spesifik restoran yang tidak ada di data.

Knowledge base relevan:
${knowledgeContext || 'Tidak ada knowledge base yang relevan untuk pertanyaan ini.'}`,
        temperature: 0.8,
      },
    });

    const response = await chat.sendMessage({ message: normalizedMessage });
    const replyText = response.text || DEFAULT_FALLBACK_TEXT;
    
    // Simpan ke cache selama 1 jam (3600000 ms) untuk menghemat kuota jika ditanya hal yang sama
    responseCache.set(cacheKey, { text: replyText, source: 'gemini', expiry: Date.now() + 3600000 });
    
    // Bersihkan cache jika terlalu besar (lebih dari 100 item)
    if (responseCache.size > 100) {
      const firstKey = responseCache.keys().next().value;
      if (firstKey) responseCache.delete(firstKey);
    }

    return jsonResponse(replyText, 'gemini');
  } catch (err: any) {
    console.error('Gemini/chatbot error:', {
      message: err?.message,
      status: err?.status,
      code: err?.code,
    });

    if (err?.message === 'GEMINI_API_KEY is not configured') {
      return jsonResponse(DEFAULT_FALLBACK_TEXT, 'fallback_api_key_missing');
    }

    return jsonResponse(DEFAULT_FALLBACK_TEXT, err?.message ? 'fallback_gemini_error' : 'fallback_default');
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
