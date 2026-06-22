import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, X, Compass, Flame, Info, ZoomIn } from 'lucide-react';
import api from '../services/api';
import { GalleryItem } from '../types';

export default function GalleryView() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FOOD' | 'INTERIOR' | 'EVENTS' | 'CHEF'>('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    api.get('/gallery').then(res => {
      setGalleryItems(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filterChips: ('ALL' | 'FOOD' | 'INTERIOR' | 'EVENTS' | 'CHEF')[] = ['ALL', 'FOOD', 'INTERIOR', 'EVENTS', 'CHEF'];

  const filteredItems = galleryItems.filter(item => {
    return activeFilter === 'ALL' || item.category === activeFilter;
  });

  return (
    <div id="gallery-view" class="font-sans text-[#E5E5E5] pb-24 pt-8">
      <div class="max-w-7xl mx-auto px-6">
        
        {/* Gallery title header block */}
        <div class="max-w-2xl text-center mx-auto mb-16">
          <span class="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium block mb-2 font-display">Atmospheric Narrative</span>
          <h2 class="font-display font-light text-4xl text-white tracking-tight">The Visual Odyssey</h2>
          <div class="h-px w-10 bg-[#C5A059]/40 mx-auto mt-4 mb-4"></div>
          <p class="text-[#E5E5E5]/50 text-xs leading-relaxed max-w-lg mx-auto mt-2 font-light">
            Step behind the scenes of three-star Michelin magic. Filter through precision-plated culinary works, luxurious seating layouts, secret private vaults, and our chefs in preparation.
          </p>
        </div>

        {/* Filter chips triggers row */}
        <div class="flex justify-center gap-2.5 mb-12 flex-wrap">
          {filterChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              class={`px-4.5 py-2.5 rounded-sm text-[10px] font-mono tracking-widest transition-all select-none cursor-pointer uppercase ${
                activeFilter === chip
                  ? 'bg-[#C5A059] text-black font-semibold'
                  : 'bg-white/5 text-[#E5E5E5]/50 hover:text-white border border-white/5'
              }`}
            >
              {chip === 'ALL' ? 'ALL ARCHIVES' : chip}
            </button>
          ))}
        </div>

        {/* Masonry-inspired bento grid */}
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
        <motion.div
          layout
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item) => (
            <motion.div
              layoutId={`gallery-wrap-${item.id}`}
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              class="relative bg-white/[0.01] border border-white/5 overflow-hidden rounded-sm cursor-pointer group shadow-lg"
            >
              {/* Image Frame */}
              <div class="relative overflow-hidden h-[340px] bg-zinc-950">
                <img
                  src={item.image}
                  alt={item.title}
                  class="w-full h-full object-cover transition-all duration-700 select-none group-hover:scale-105 filter saturate-[0.8] brightness-90 group-hover:saturate-100 group-hover:brightness-100"
                />
                
                {/* Dark Hover Plate */}
                <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-zinc-950/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                {/* Floating category tag */}
                <span class="absolute top-4 left-4 bg-[#0A0A0B]/80 border border-white/10 text-[#C5A059] font-mono text-[8px] uppercase tracking-widest px-2.5 py-1.5 rounded-sm">
                  {item.category}
                </span>

                {/* Center zoom microindicator */}
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="w-11 h-11 rounded-sm bg-[#C5A059] border border-[#C5A059]/30 text-black flex items-center justify-center shadow-lg shadow-[#C5A059]/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn class="w-5 h-5" />
                  </div>
                </div>

                {/* Description and Title overlay bottom */}
                <div class="absolute bottom-6 left-6 right-6 space-y-1 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 class="font-display text-base font-semibold text-zinc-100 tracking-wide">{item.title}</h3>
                  <p class="text-[11px] text-zinc-400 truncate leading-relaxed max-w-xs">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>

      {/* Fullscreen elegant Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            id="lightbox-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            class="fixed inset-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
          >
            {/* Top Close Bar controls */}
            <div class="w-full max-w-5xl flex justify-between items-center mb-4">
              <div class="flex items-center gap-2.5">
                <span class="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
                <span class="text-[10px] font-mono text-[#E5E5E5]/50 uppercase tracking-widest leading-none">CELLAR GALLERY PILL &bull; ZOOM MODE</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                class="text-[#E5E5E5]/50 hover:text-white p-2 border border-white/10 rounded-sm hover:bg-white/5 transition-all cursor-pointer"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            {/* Immersive Image Display Frame */}
            <div class="w-full max-w-5xl bg-white/[0.02] border border-white/10 rounded-sm p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8 shadow-2xl relative overflow-hidden">
              {/* Image box left */}
              <div class="w-full md:w-3/5 h-[320px] md:h-[500px] overflow-hidden rounded-sm bg-zinc-950 border border-white/5">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  class="w-full h-full object-cover shadow-inner"
                />
              </div>

              {/* Text content details right */}
              <div class="w-full md:w-2/5 flex flex-col justify-between py-2">
                <div class="space-y-6">
                  {/* Category badge */}
                  <div>
                    <span class="bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm inline-block">
                      {selectedPhoto.category}
                    </span>
                  </div>

                  {/* Title heading */}
                  <div class="space-y-2">
                    <h3 class="font-display font-light text-2xl text-zinc-100 tracking-tight">{selectedPhoto.title}</h3>
                    <div class="h-px w-10 bg-[#C5A059]/40 mt-3"></div>
                  </div>

                  {/* Description Paragraph */}
                  <div class="space-y-3">
                    <p class="text-xs text-[#E5E5E5]/60 leading-relaxed font-sans font-light">{selectedPhoto.description}</p>
                    <p class="text-[11px] text-white/45 leading-relaxed font-sans font-light">
                      Our spaces are configured with noise-absorbing stone walls, ambient dimmer setups, and hand-woven details to prioritize complete, undisturbed conversations.
                    </p>
                  </div>
                </div>

                {/* Additional footer context */}
                <div class="bg-[#0A0A0B] p-4 border border-white/5 rounded-sm space-y-2 mt-6">
                  <div class="flex items-center gap-2 text-[9px] uppercase font-mono tracking-widest text-[#C5A059]">
                    <Info class="w-3.5 h-3.5" />
                    <span>Plating Artifact Guidelines</span>
                  </div>
                  <p class="text-[10px] text-white/40 font-sans leading-relaxed font-light">
                    Designed for aesthetic pairing logs. Replaced and refreshed daily in alignment with solar seasons.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
