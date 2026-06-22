import { Router, Response } from 'express';
import { auth, db } from '../config/firebase';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
// Client sends Firebase ID token; server verifies and returns user data
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required.' });
    }

    const decoded = await auth.verifyIdToken(idToken);

    // Check if user exists in Firestore users collection
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    let userData;

    if (userDoc.exists) {
      userData = { id: decoded.uid, ...userDoc.data() };
    } else {
      // Create user document if it doesn't exist
      userData = {
        id: decoded.uid,
        email: decoded.email || '',
        name: decoded.name || decoded.email?.split('@')[0] || 'Admin',
        role: 'admin',
      };
      await db.collection('users').doc(decoded.uid).set(userData);
    }

    return res.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userDoc = await db.collection('users').doc(req.user!.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    const data = userDoc.data();
    return res.json({ id: req.user!.id, ...data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
