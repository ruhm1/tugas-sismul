import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import type { Query } from 'firebase-admin/firestore';
import { authMiddleware, AuthRequest } from '../middleware/auth';

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
    const { status } = req.query;
    let query: Query = db.collection('reservations');

    if (status) {
      query = query.where('status', '==', String(status));
    }

    const snap = await query.get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort by createdAt desc (client-side since Firestore ordering on non-indexed fields)
    items.sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    res.json({ data: items, total: items.length, page: 1, totalPages: 1 });
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

    const data = {
      reservationCode: generateCode(),
      userName,
      email,
      phone,
      date,
      time,
      guestsCount: Number(guestsCount),
      specialRequests: specialRequests || null,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await db.collection('reservations').add(data);
    res.status(201).json({ id: ref.id, ...data });
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
    await db.collection('reservations').doc(req.params.id).update({
      status,
      updatedAt: new Date().toISOString(),
    });
    const updated = await db.collection('reservations').doc(req.params.id).get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reservations/:id - protected
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await db.collection('reservations').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
