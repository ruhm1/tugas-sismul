import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/promotions - public
router.get('/', async (req: Request, res: Response) => {
  try {
    const { active } = req.query;
    let query = db.collection('promotions') as FirebaseFirestore.Query;

    if (active === 'true') {
      query = query.where('isActive', '==', true);
    }

    const snap = await query.get();
    const promos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort by createdAt desc
    promos.sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    res.json(promos);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/promotions/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('promotions').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Promotion not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/promotions - protected
router.post('/', authMiddleware, upload.single('banner'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate, isActive } = req.body;
    const banner = req.file ? `/uploads/${req.file.filename}` : req.body.banner;

    const data = {
      title,
      description: description || '',
      banner: banner || '',
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      isActive: isActive !== 'false' && isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await db.collection('promotions').add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/promotions/:id - protected
router.put('/:id', authMiddleware, upload.single('banner'), async (req: AuthRequest, res: Response) => {
  try {
    const data: any = { updatedAt: new Date().toISOString() };
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.description !== undefined) data.description = req.body.description;
    if (req.body.startDate) data.startDate = new Date(req.body.startDate).toISOString();
    if (req.body.endDate) data.endDate = new Date(req.body.endDate).toISOString();
    if (req.body.isActive !== undefined) data.isActive = req.body.isActive !== 'false' && req.body.isActive !== false;
    if (req.file) data.banner = `/uploads/${req.file.filename}`;
    else if (req.body.banner) data.banner = req.body.banner;

    await db.collection('promotions').doc(req.params.id).update(data);
    const updated = await db.collection('promotions').doc(req.params.id).get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/promotions/:id - protected
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await db.collection('promotions').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
