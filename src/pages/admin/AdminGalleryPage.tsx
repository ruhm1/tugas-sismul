import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

export default function AdminGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', image: '', category: 'FOOD' });

  const fetchData = async () => {
    try { const res = await api.get('/gallery'); setItems(res.data || []); } catch { /* ignore */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ title: '', description: '', image: '', category: 'FOOD' }); setShowModal(true); };
  const openEdit = (item: any) => { setEditItem(item); setForm({ title: item.title, description: item.description, image: item.image, category: item.category }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) { await api.put(`/gallery/${editItem.id}`, form); showToast('Updated', 'success'); }
      else { await api.post('/gallery', form); showToast('Created', 'success'); }
      setShowModal(false); fetchData();
    } catch { showToast('Error', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/gallery/${id}`); showToast('Deleted', 'success'); fetchData(); } catch { showToast('Error', 'error'); }
  };

  const cats = ['FOOD', 'INTERIOR', 'EVENTS', 'CHEF'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] block mb-1">Gallery</span><h1 className="font-display font-light text-3xl text-white">Manage Gallery</h1></div>
        <button onClick={openAdd} className="bg-[#C5A059] hover:bg-[#8E6E3A] text-black font-display text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"><Plus className="w-4 h-4" /> Add Photo</button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden group">
              <div className="h-48 bg-zinc-900 relative overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <span className="absolute top-3 left-3 bg-black/70 text-[#C5A059] font-mono text-[8px] uppercase tracking-widest px-2 py-1 rounded">{item.category}</span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-display text-sm text-white font-medium">{item.title}</h3>
                <p className="text-[10px] text-white/40 line-clamp-2">{item.description}</p>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => openEdit(item)} className="text-[10px] text-[#C5A059] border border-[#C5A059]/20 px-3 py-1.5 rounded cursor-pointer hover:bg-[#C5A059]/10"><Edit className="w-3 h-3 inline mr-1" />Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-[10px] text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded cursor-pointer hover:bg-rose-500/10"><Trash2 className="w-3 h-3 inline mr-1" />Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-xl p-6 w-full max-w-lg space-y-5">
            <div className="flex justify-between"><h3 className="font-display text-lg text-white">{editItem ? 'Edit' : 'Add'} Gallery</h3><button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Title" className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" />
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Description" rows={3} className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none resize-none" />
              <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="Image URL" className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none">
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" className="w-full bg-[#C5A059] hover:bg-[#8E6E3A] text-black font-display text-xs py-3 rounded-lg cursor-pointer">{editItem ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
