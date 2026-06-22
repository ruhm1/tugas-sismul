import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const prisma = new PrismaClient();
const router = Router();

// GET /api/menu/categories - must be before /:id
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/menu - public, with search, filter, pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category, page = '1', limit = '50' } = req.query;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = { slug: String(category) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      prisma.menu.findMany({
        where,
        include: { category: true },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.menu.count({ where }),
    ]);

    res.json({
      data: items.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        description: m.description,
        category: m.category.name,
        tags: m.tags,
        image: m.image,
        isSignature: m.isSignature,
        isAvailable: m.isAvailable,
      })),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/menu/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.menu.findUnique({ where: { id: req.params.id }, include: { category: true } });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({
      ...item,
      category: item.category.name,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/menu - protected
router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, description, categoryId, tags, isSignature, isAvailable } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const item = await prisma.menu.create({
      data: {
        name,
        price: Number(price) || 0,
        description: description || '',
        categoryId,
        tags: typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : (tags || []),
        isSignature: isSignature === 'true' || isSignature === true,
        isAvailable: isAvailable !== 'false' && isAvailable !== false,
        image: image || '',
      },
      include: { category: true },
    });
    res.status(201).json({ ...item, category: item.category.name });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/menu/:id - protected
router.put('/:id', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, description, categoryId, tags, isSignature, isAvailable } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = Number(price);
    if (description !== undefined) data.description = description;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (tags !== undefined) data.tags = typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : tags;
    if (isSignature !== undefined) data.isSignature = isSignature === 'true' || isSignature === true;
    if (isAvailable !== undefined) data.isAvailable = isAvailable !== 'false' && isAvailable !== false;
    if (image) data.image = image;

    const item = await prisma.menu.update({ where: { id: req.params.id }, data, include: { category: true } });
    res.json({ ...item, category: item.category.name });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/menu/:id - protected
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.menu.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
