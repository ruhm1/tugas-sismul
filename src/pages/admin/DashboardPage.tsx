import React, { useState, useEffect } from 'react';
import { Calendar, UtensilsCrossed, Tag, Mail, BarChart2, RefreshCw } from 'lucide-react';
import api from '../../services/api';

interface Stats {
  totalMenu: number;
  totalReservations: number;
  totalPromos: number;
  totalContacts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalMenu: 0, totalReservations: 0, totalPromos: 0, totalContacts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const cards = [
    { label: 'Total Menu', value: stats.totalMenu, icon: <UtensilsCrossed className="w-5 h-5" />, color: 'text-[#C5A059]' },
    { label: 'Reservations', value: stats.totalReservations, icon: <Calendar className="w-5 h-5" />, color: 'text-emerald-400' },
    { label: 'Promotions', value: stats.totalPromos, icon: <Tag className="w-5 h-5" />, color: 'text-amber-400' },
    { label: 'Messages', value: stats.totalContacts, icon: <Mail className="w-5 h-5" />, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] font-semibold block mb-1">Dashboard</span>
          <h1 className="font-display font-light text-3xl text-white">Command Center</h1>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-1.5 text-xs text-[#C5A059] border border-[#C5A059]/20 bg-[#C5A059]/5 hover:bg-[#C5A059]/10 px-4 py-2.5 rounded-lg transition-all cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div key={card.label} className="bg-[#111113] border border-white/5 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{card.label}</p>
                  <h3 className="font-display font-bold text-3xl text-white mt-1">{card.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Simple CSS Bar Chart */}
          <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-display text-lg text-white font-medium">Statistics Overview</h3>
            </div>
            <div className="space-y-4">
              {cards.map((card) => {
                const max = Math.max(...(Object.values(stats) as number[]), 1);
                const pct = (card.value / max) * 100;
                return (
                  <div key={card.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60 font-mono">{card.label}</span>
                      <span className="text-white font-medium">{card.value}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C5A059] to-[#8E6E3A] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
