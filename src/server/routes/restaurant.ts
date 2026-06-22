import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/restaurant - public
router.get('/', async (_req: Request, res: Response) => {
  try {
    const doc = await db.collection('restaurant_profiles').doc('default').get();
    if (!doc.exists) return res.status(404).json({ error: 'No restaurant profile found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/restaurant - protected
router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const data = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('restaurant_profiles').doc('default').set(data, { merge: true });
    const updated = await db.collection('restaurant_profiles').doc('default').get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
