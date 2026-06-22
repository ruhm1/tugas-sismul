import React, { useState, useEffect } from 'react';
import { Check, RefreshCw, X, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

export default function AdminReservationPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/reservations');
      setReservations(res.data.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const changeStatus = async (id: string, status: string) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      showToast(`Status diperbarui menjadi ${status}`, 'success');
      fetchData();
    } catch { showToast('Gagal memperbarui status', 'error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus reservasi ini?')) return;
    try { await api.delete(`/reservations/${id}`); showToast('Dihapus', 'success'); fetchData(); } catch { showToast('Gagal', 'error'); }
  };

  const statusColor: Record<string, string> = {
    Confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] block mb-1">Reservasi</span>
        <h1 className="font-display font-light text-3xl text-white">Kelola Reservasi</h1>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <tr><th className="p-4">Tamu</th><th className="p-4">Tanggal/Waktu</th><th className="p-4">Jumlah</th><th className="p-4">Kode</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reservations.map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="p-4"><div className="text-white font-medium">{r.userName}</div><div className="text-[10px] text-white/40 font-mono">{r.email}</div></td>
                    <td className="p-4 font-mono"><span className="text-white">{r.date}</span><span className="block text-[#C5A059] text-[10px]">{r.time}</span></td>
                    <td className="p-4 text-white/60">{r.guestsCount}</td>
                    <td className="p-4 font-mono text-[#C5A059] text-[10px]">{r.reservationCode}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-mono uppercase border ${statusColor[r.status] || ''}`}>{r.status}</span></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => changeStatus(r.id, 'Confirmed')} title="Konfirmasi" className="p-1.5 rounded border border-white/10 hover:border-emerald-500/30 text-white/50 hover:text-emerald-400 cursor-pointer"><Check className="w-3 h-3" /></button>
                        <button onClick={() => changeStatus(r.id, 'Pending')} title="Tertunda" className="p-1.5 rounded border border-white/10 hover:border-amber-500/30 text-white/50 hover:text-amber-400 cursor-pointer"><RefreshCw className="w-3 h-3" /></button>
                        <button onClick={() => changeStatus(r.id, 'Cancelled')} title="Batal" className="p-1.5 rounded border border-white/10 hover:border-rose-500/30 text-white/50 hover:text-rose-400 cursor-pointer"><X className="w-3 h-3" /></button>
                        <button onClick={() => handleDelete(r.id)} title="Hapus" className="p-1.5 rounded border border-white/10 hover:border-rose-500/30 text-white/50 hover:text-rose-400 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
