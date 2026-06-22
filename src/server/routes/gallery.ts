import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const prisma = new PrismaClient();
const router = Router();

// GET /api/gallery - public
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category) where.category = String(category);

    const items = await prisma.gallery.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/gallery - protected
router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const item = await prisma.gallery.create({
      data: { title, description: description || '', category: category || 'FOOD', image: image || '' },
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/gallery/:id - protected
router.put('/:id', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const data: any = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.description !== undefined) data.description = req.body.description;
    if (req.body.category !== undefined) data.category = req.body.category;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    else if (req.body.image) data.image = req.body.image;

    const item = await prisma.gallery.update({ where: { id: req.params.id }, data });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/gallery/:id - protected
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
