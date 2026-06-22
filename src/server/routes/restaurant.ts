import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// GET /api/restaurant - public
router.get('/', async (_req: Request, res: Response) => {
  try {
    const profile = await prisma.restaurantProfile.findFirst();
    if (!profile) return res.status(404).json({ error: 'No restaurant profile found' });
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/restaurant - protected
router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.restaurantProfile.findFirst();
    if (!existing) {
      const created = await prisma.restaurantProfile.create({ data: req.body });
      return res.json(created);
    }
    const updated = await prisma.restaurantProfile.update({
      where: { id: existing.id },
      data: req.body,
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
