import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const prisma = new PrismaClient();
const router = Router();

// GET /api/promotions - public
router.get('/', async (req: Request, res: Response) => {
  try {
    const { active } = req.query;
    const where: any = {};
    if (active === 'true') where.isActive = true;

    const promos = await prisma.promotion.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(promos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/promotions/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const promo = await prisma.promotion.findUnique({ where: { id: req.params.id } });
    if (!promo) return res.status(404).json({ error: 'Promotion not found' });
    res.json(promo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/promotions - protected
router.post('/', authMiddleware, upload.single('banner'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate, isActive } = req.body;
    const banner = req.file ? `/uploads/${req.file.filename}` : req.body.banner;

    const promo = await prisma.promotion.create({
      data: {
        title,
        description: description || '',
        banner: banner || '',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive !== 'false' && isActive !== false,
      },
    });
    res.status(201).json(promo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/promotions/:id - protected
router.put('/:id', authMiddleware, upload.single('banner'), async (req: AuthRequest, res: Response) => {
  try {
    const data: any = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.description !== undefined) data.description = req.body.description;
    if (req.body.startDate) data.startDate = new Date(req.body.startDate);
    if (req.body.endDate) data.endDate = new Date(req.body.endDate);
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive !== 'false' && req.body.isActive !== false;
    if (req.file) data.banner = `/uploads/${req.file.filename}`;
    else if (req.body.banner) data.banner = req.body.banner;

    const promo = await prisma.promotion.update({ where: { id: req.params.id }, data });
    res.json(promo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/promotions/:id - protected
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.promotion.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
