import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

function generateCode(): string {
  const now = new Date();
  const d = now.toISOString().slice(0, 10).replace(/-/g, '');
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GRT-${d}-${r}`;
}

// GET /api/reservations - protected
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = '1', limit = '50' } = req.query;
    const where: any = {};
    if (status) where.status = String(status);
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      prisma.reservation.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.reservation.count({ where }),
    ]);
    res.json({ data: items, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations - public
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userName, email, phone, date, time, guestsCount, specialRequests } = req.body;
    if (!userName || !email || !phone || !date || !time || !guestsCount) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    const reservation = await prisma.reservation.create({
      data: {
        reservationCode: generateCode(),
        userName,
        email,
        phone,
        date,
        time,
        guestsCount: Number(guestsCount),
        specialRequests: specialRequests || null,
        status: 'Pending',
      },
    });
    res.status(201).json(reservation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/reservations/:id/status - protected
router.put('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });
    }
    const reservation = await prisma.reservation.update({ where: { id: req.params.id }, data: { status } });
    res.json(reservation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reservations/:id - protected
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.reservation.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
