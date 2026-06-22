import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

export default function AdminPromoPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', banner: '', startDate: '', endDate: '', isActive: true });

  const fetchData = async () => {
    try { const res = await api.get('/promotions'); setPromos(res.data || []); } catch { /* ignore */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ title: '', description: '', banner: '', startDate: '', endDate: '', isActive: true }); setShowModal(true); };
  const openEdit = (p: any) => {
    setEditItem(p);
    setForm({ title: p.title, description: p.description, banner: p.banner, startDate: p.startDate?.slice(0,10), endDate: p.endDate?.slice(0,10), isActive: p.isActive });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) { await api.put(`/promotions/${editItem.id}`, form); showToast('Updated', 'success'); }
      else { await api.post('/promotions', form); showToast('Created', 'success'); }
      setShowModal(false); fetchData();
    } catch { showToast('Error', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/promotions/${id}`); showToast('Deleted', 'success'); fetchData(); } catch { showToast('Error', 'error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] block mb-1">Promotions</span><h1 className="font-display font-light text-3xl text-white">Manage Promos</h1></div>
        <button onClick={openAdd} className="bg-[#C5A059] hover:bg-[#8E6E3A] text-black font-display text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"><Plus className="w-4 h-4" /> Add Promo</button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promos.map(p => (
            <div key={p.id} className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
              <div className="h-40 bg-zinc-900 relative">
                <img src={p.banner || ''} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start"><h3 className="font-display text-base text-white font-medium">{p.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase ${p.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-xs text-white/50 line-clamp-2">{p.description}</p>
                <p className="text-[10px] font-mono text-white/30">{new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}</p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => openEdit(p)} className="flex items-center gap-1 text-[10px] text-[#C5A059] border border-[#C5A059]/20 px-3 py-1.5 rounded cursor-pointer hover:bg-[#C5A059]/10"><Edit className="w-3 h-3" /> Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 text-[10px] text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded cursor-pointer hover:bg-rose-500/10"><Trash2 className="w-3 h-3" /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-white/10 rounded-xl p-6 w-full max-w-lg space-y-5">
            <div className="flex justify-between"><h3 className="font-display text-lg text-white">{editItem ? 'Edit' : 'Add'} Promotion</h3><button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Title" className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" />
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Description" rows={3} className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none resize-none" />
              <input value={form.banner} onChange={e => setForm({...form, banner: e.target.value})} placeholder="Banner URL" className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[9px] font-mono text-white/40 block mb-1">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" /></div>
                <div><label className="text-[9px] font-mono text-white/40 block mb-1">End Date</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required className="w-full bg-[#0A0A0B] border border-white/10 text-xs rounded-lg p-3 text-white outline-none" /></div>
              </div>
              <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="accent-[#C5A059]" /> Active</label>
              <button type="submit" className="w-full bg-[#C5A059] hover:bg-[#8E6E3A] text-black font-display text-xs py-3 rounded-lg cursor-pointer">{editItem ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
