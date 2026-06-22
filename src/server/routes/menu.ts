import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import type { Query } from 'firebase-admin/firestore';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/menu/categories - must be before /:id
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const snap = await db.collection('categories').orderBy('name').get();
    const categories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/menu - public, with search, filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;
    let query: Query = db.collection('menus');

    if (category) {
      query = query.where('category', '==', String(category));
    }

    const snap = await query.get();
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Client-side text search (Firestore doesn't support full-text search natively)
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter(item => {
        const data = item as any;
        return data.name?.toLowerCase().includes(q) || data.description?.toLowerCase().includes(q);
      });
    }

    res.json({ data: items, total: items.length, page: 1, totalPages: 1 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/menu/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('menus').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/menu - protected
router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, description, category, tags, isSignature, isAvailable } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const data = {
      name,
      price: Number(price) || 0,
      description: description || '',
      category: category || 'Makanan',
      tags: typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : (tags || []),
      isSignature: isSignature === 'true' || isSignature === true,
      isAvailable: isAvailable !== 'false' && isAvailable !== false,
      image: image || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await db.collection('menus').add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/menu/:id - protected
router.put('/:id', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, description, category, tags, isSignature, isAvailable } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const data: any = { updatedAt: new Date().toISOString() };
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = Number(price);
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (tags !== undefined) data.tags = typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : tags;
    if (isSignature !== undefined) data.isSignature = isSignature === 'true' || isSignature === true;
    if (isAvailable !== undefined) data.isAvailable = isAvailable !== 'false' && isAvailable !== false;
    if (image) data.image = image;

    await db.collection('menus').doc(req.params.id).update(data);
    const updated = await db.collection('menus').doc(req.params.id).get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/menu/:id - protected
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await db.collection('menus').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
