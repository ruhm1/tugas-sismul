import { Router } from 'express';
import { db } from '../config/firebase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/admin/stats - protected
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const [menuSnap, resSnap, promoSnap, contactSnap] = await Promise.all([
      db.collection('menus').count().get(),
      db.collection('reservations').count().get(),
      db.collection('promotions').count().get(),
      db.collection('contacts').count().get(),
    ]);

    res.json({
      totalMenu: menuSnap.data().count,
      totalReservations: resSnap.data().count,
      totalPromos: promoSnap.data().count,
      totalContacts: contactSnap.data().count,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
