import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/gallery - public
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query = db.collection('galleries') as FirebaseFirestore.Query;

    if (category) {
      query = query.where('category', '==', String(category));
    }

    const snap = await query.get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    items.sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || ''));
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

    const data = {
      title,
      description: description || '',
      category: category || 'FOOD',
      image: image || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await db.collection('galleries').add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/gallery/:id - protected
router.put('/:id', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const data: any = { updatedAt: new Date().toISOString() };
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.description !== undefined) data.description = req.body.description;
    if (req.body.category !== undefined) data.category = req.body.category;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    else if (req.body.image) data.image = req.body.image;

    await db.collection('galleries').doc(req.params.id).update(data);
    const updated = await db.collection('galleries').doc(req.params.id).get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/gallery/:id - protected
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await db.collection('galleries').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
