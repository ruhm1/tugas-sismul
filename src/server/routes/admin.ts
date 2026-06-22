import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// GET /api/admin/stats - protected
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const [totalMenu, totalReservations, totalPromos, totalContacts] = await Promise.all([
      prisma.menu.count(),
      prisma.reservation.count(),
      prisma.promotion.count(),
      prisma.contact.count(),
    ]);
    res.json({ totalMenu, totalReservations, totalPromos, totalContacts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
