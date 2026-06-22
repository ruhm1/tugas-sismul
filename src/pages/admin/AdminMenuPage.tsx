import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', categoryId: '', tags: '', isSignature: false, image: '', isAvailable: true });

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([api.get('/menu?limit=100'), api.get('/menu/categories')]);
      setItems(menuRes.data.data || []);
      setCategories(catRes.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', price: '', description: '', categoryId: categories[0]?.id || '', tags: '', isSignature: false, image: '', isAvailable: true });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      name: item.name, price: String(item.price), description: item.description,
      categoryId: categories.find(c => c.name === item.category)?.id || '',
      tags: item.tags?.join(', ') || '', isSignature: !!item.isSignature, image: item.image, isAvailable: item.isAvailable !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, price: Number(form.price), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (editItem) {
        await api.put(`/menu/${editItem.id}`, body);
        showToast('Menu updated', 'success');
      } else {
        await api.post('/menu', body);
        showToast('Menu added', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch { showToast('Error saving menu item', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try { await api.delete(`/menu/${id}`); showToast('Deleted', 'success'); fetchData(); } catch { showToast('Error', 'error'); }
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] block mb-1">Menu Management</span>
          <h1 className="font-display font-light text-3xl text-white">Menu Items</h1>
        </div>
        <button onClick={openAdd} className="bg-[#C5A059] hover:bg-[#8E6E3A] text-black font-display text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu..." className="w-full bg-[#111113] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs rounded-lg pl-9 pr-4 py-2.5 text-white transition-all" />
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <tr><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-900" referrerPolicy="no-referrer" />
                      <div><span className="text-white font-medium">{item.name}</span></div>
                    </td>
                    <td className="p-4 font-mono text-white/50">{item.category}</td>
                    <td className="p-4 font-mono text-[#C5A059]">${item.price}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-mono uppercase ${item.isAvailable !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{item.isAvailable !== false ? 'Available' : 'Unavailable'}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg border border-white/10 hover:border-[#C5A059]/30 text-white/50 hover:text-[#C5A059] cursor-pointer mr-1"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/30 text-white/50 hover:text-rose-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-xl p-6 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-lg text-white">{editItem ? 'Edit' : 'Add'} Menu Item</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white p-1 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Item name" className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs rounded-lg p-3 text-white" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required placeholder="Price" className="bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" />
              </div>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Description" rows={3} className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none resize-none" />
              <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="Image URL" className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" />
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Tags (comma separated)" className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" />
              <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                <input type="checkbox" checked={form.isSignature} onChange={e => setForm({...form, isSignature: e.target.checked})} className="accent-[#C5A059]" /> Signature Item
              </label>
              <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} className="accent-[#C5A059]" /> Available
              </label>
              <button type="submit" className="w-full bg-[#C5A059] hover:bg-[#8E6E3A] text-black font-display text-xs py-3 rounded-lg cursor-pointer">
                {editItem ? 'Update' : 'Create'} Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
