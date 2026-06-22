import React, { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

export default function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try { const res = await api.get('/contacts'); setMessages(res.data || []); } catch { /* ignore */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try { await api.delete(`/contacts/${id}`); showToast('Deleted', 'success'); fetchData(); } catch { showToast('Error', 'error'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] block mb-1">Messages</span>
        <h1 className="font-display font-light text-3xl text-white">Contact Messages</h1>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>
      ) : messages.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
          <Mail className="w-8 h-8 text-white/30 mx-auto mb-3" />
          <p className="text-xs text-white/40">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="bg-[#111113] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-sm text-white font-medium">{msg.subject}</h3>
                  <p className="text-[10px] font-mono text-white/40 mt-0.5">{msg.name} &lt;{msg.email}&gt;</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/30">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => handleDelete(msg.id)} className="p-1.5 rounded border border-white/10 hover:border-rose-500/30 text-white/50 hover:text-rose-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
