import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Calendar, X } from 'lucide-react';
import api from '../services/api';

interface Promotion {
  id: string;
  title: string;
  description: string;
  banner: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Promotion | null>(null);

  useEffect(() => {
    api.get('/promotions').then((res) => {
      setPromos(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="font-sans text-[#E5E5E5] pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium block mb-2">Exclusive Offers</span>
          <h1 className="font-display font-light text-4xl md:text-5xl text-white tracking-tight">Promotions</h1>
          <div className="h-px w-10 bg-[#C5A059]/40 mx-auto mt-4" />
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : promos.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-sm">
            <Tag className="w-8 h-8 text-white/30 mx-auto mb-3" />
            <p className="text-xs text-white/40">No promotions available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promos.map((promo) => (
              <motion.div
                key={promo.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelected(promo)}
                className="bg-white/[0.03] border border-white/5 rounded-sm overflow-hidden cursor-pointer group hover:border-[#C5A059]/20 transition-all"
              >
                <div className="relative h-56 overflow-hidden bg-zinc-950">
                  <img
                    src={promo.banner || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
                  {promo.isActive && (
                    <span className="absolute top-4 left-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-sm">
                      Active
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-lg text-white font-medium">{promo.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{promo.description}</p>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl"
            >
              <div className="relative h-64">
                <img src={selected.banner || ''} alt={selected.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white/60 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <h2 className="font-display text-2xl text-white font-medium">{selected.title}</h2>
                <p className="text-sm text-white/60 leading-relaxed">{selected.description}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A059]">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selected.startDate).toLocaleDateString()} - {new Date(selected.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
