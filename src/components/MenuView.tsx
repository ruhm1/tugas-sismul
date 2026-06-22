import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Wine, BookOpen, Clock, Users, Flame, Star, Check } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuViewProps {
  onSuggestWinePairing: (dishName: string) => void;
}

export default function MenuView({ onSuggestWinePairing }: MenuViewProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Appetizers' | 'Mains' | 'Desserts' | 'Wines'>('All');
  
  // Tasting List / Wishlist
  const [wishlist, setWishlist] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetchMenuItems();
    // Load wishlist from local storage if available
    const saved = localStorage.getItem('gourmet_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const json = await res.json();
      setMenuItems(json.data);
    } catch (e) {
      console.error("Error fetching menu items:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = (item: MenuItem) => {
    let updated: MenuItem[];
    if (wishlist.some(x => x.id === item.id)) {
      updated = wishlist.filter(x => x.id !== item.id);
    } else {
      updated = [...wishlist, item];
    }
    setWishlist(updated);
    localStorage.setItem('gourmet_wishlist', JSON.stringify(updated));
  };

  // Filter computations
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: ('All' | 'Appetizers' | 'Mains' | 'Desserts' | 'Wines')[] = ['All', 'Appetizers', 'Mains', 'Desserts', 'Wines'];

  return (
    <div id="menu-view" class="font-sans text-[#E5E5E5] pb-24 pt-8">
      {/* Search and Categories controls header bar */}
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 mb-12">
          <div>
            <span class="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium block mb-2">Our Culinary Art</span>
            <h2 class="font-display font-light text-4xl text-white tracking-tight">The Seasonal Menu</h2>
            <p class="text-[#E5E5E5]/50 text-xs mt-1.5 max-w-lg font-light leading-relaxed">
              Each selection represents a season of precision. Search or filter through appetizers, organic masterpieces, mains, and rare vintage cellar pairings.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search inputs */}
            <div class="relative w-full sm:w-72">
              <span class="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none">
                <Search class="w-4 h-4 text-[#E5E5E5]/40" />
              </span>
              <input
                id="menu-search-input"
                type="text"
                placeholder="Search dish, vintage, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs rounded-sm pl-9.5 pr-4 py-3 text-zinc-100 placeholder:text-zinc-500 transition-all font-sans"
              />
            </div>
          </div>
        </div>

        {/* Filter categories tabs & Wishlist overview trigger */}
        <div class="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div class="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                class={`px-4.5 py-2.5 rounded-sm text-[10px] uppercase tracking-[0.15em] transition-all font-display font-semibold cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#C5A059] text-black border border-[#C5A059]/10'
                    : 'bg-white/5 text-[#E5E5E5]/60 hover:text-white border border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {wishlist.length > 0 && (
            <div class="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-sm px-4 py-2.5 flex items-center gap-2.5">
              <Heart class="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059] animate-pulse" />
              <span class="text-xs text-[#C5A059] font-mono">
                My Tasting Menu: <strong class="text-zinc-100">{wishlist.length} Selection{wishlist.length === 1 ? '' : 's'}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Grid List */}
        {loading ? (
          <div class="py-20 flex flex-col items-center justify-center gap-3">
            <div class="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs text-[#E5E5E5]/50 font-mono tracking-widest">PLACING DECORATIVE PLATTERS...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div class="py-24 text-center border border-dashed border-white/10 rounded-sm bg-white/[0.01]">
            <Wine class="w-8 h-8 text-[#E5E5E5]/30 mx-auto mb-3" />
            <h4 class="font-display text-[#E5E5E5]/80 font-medium">No Culinary Masterpieces Found</h4>
            <p class="text-[#E5E5E5]/40 text-xs mt-1.5 font-sans font-light">Modify your filters or ask our AI Sommelier to suggest unique preparations.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const inWishlist = wishlist.some(x => x.id === item.id);
              return (
                <motion.div
                  key={item.id}
                  layoutId={`menu-card-${item.id}`}
                  whileHover={{ y: -5 }}
                  class="bg-white/[0.03] border border-white/5 rounded-sm overflow-hidden shadow-lg hover:border-[#C5A059]/30 transition-all flex flex-col"
                >
                  {/* Card Image */}
                  <div class="relative h-60 overflow-hidden bg-zinc-950 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/95 via-transparent to-transparent"></div>

                    {/* Tags */}
                    <div class="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                      {item.isSignature && (
                        <span class="bg-[#C5A059] text-black font-mono font-bold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm flex items-center gap-1">
                          <Star class="w-2.5 h-2.5 fill-current" /> Signature
                        </span>
                      )}
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          class="bg-[#0A0A0B]/80 border border-white/10 text-[#C5A059] font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Quick wishlist selector */}
                    <button
                      onClick={() => handleToggleWishlist(item)}
                      class="absolute top-4 right-4 p-2 rounded-sm bg-[#0A0A0B]/80 border border-white/10 text-[#E5E5E5]/50 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Heart class={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body content */}
                  <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div class="space-y-2">
                      <div class="flex items-start justify-between gap-2.5">
                        <h3 class="font-display font-medium text-base text-zinc-100 tracking-wide">{item.name}</h3>
                        <span class="text-[#C5A059] font-display font-light text-base shrink-0">${item.price}</span>
                      </div>
                      <p class="text-[#E5E5E5]/60 text-xs font-sans leading-relaxed font-light">{item.description}</p>
                    </div>

                    <div class="pt-3 flex items-center justify-between border-t border-white/5 text-[10px] font-mono">
                      <span class="text-white/40 tracking-wider uppercase">{item.category}</span>
                      <button
                        onClick={() => onSuggestWinePairing(item.name)}
                        class="text-[#C5A059] hover:text-white font-display tracking-widest uppercase text-[9px] font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                      >
                        <Wine class="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                        <span>Pairing Guide</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tasting Menu Drawer / Sidebar Planner */}
        {wishlist.length > 0 && (
          <div class="mt-20 bg-white/[0.02] border border-white/5 rounded-sm p-6 md:p-8">
            <div class="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-white/5 pb-6 mb-6">
              <div>
                <span class="text-[9px] text-[#C5A059] tracking-[0.2em] font-mono font-semibold uppercase block mb-1">Interactive Tasting Lounge</span>
                <h3 class="font-display text-2xl text-white font-light tracking-tight">Your Handcrafted Micro-Tasting Menu</h3>
                <p class="text-zinc-500 text-xs mt-1.5 leading-relaxed font-light font-sans">
                  Review your unique composition. Ask our AI sommelier to comment or print pairing notes for your session!
                </p>
              </div>

              <div class="flex items-center gap-3">
                <button
                  onClick={() => onSuggestWinePairing(`Pairing critique for my tasting list: ${wishlist.map(x=>x.name).join(', ')}`)}
                  class="bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] font-display uppercase tracking-widest py-2.5 px-5 rounded-sm text-[10px] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Wine class="w-4 h-4 text-[#C5A059]" />
                  Critique My Selections
                </button>
                <button
                  onClick={() => {
                    setWishlist([]);
                    localStorage.removeItem('gourmet_wishlist');
                  }}
                  class="text-xs text-white/40 hover:text-rose-400 font-mono underline"
                >
                  Clear List
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {wishlist.map((item, idx) => (
                <div key={item.id} class="flex items-center gap-3 bg-white/[0.01] p-3.5 border border-white/5 rounded-sm relative group">
                  <div class="w-10 h-10 rounded-sm overflow-hidden bg-zinc-900 shrink-0">
                    <img src={item.image} alt={item.name} class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0 pr-4">
                    <p class="text-xs text-zinc-100 font-display font-medium truncate">{item.name}</p>
                    <p class="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">{item.category}</p>
                  </div>
                  <span class="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#0A0A0B] border border-white/10 flex items-center justify-center text-[9px] text-[#C5A059] font-mono font-medium">
                    {idx + 1}
                  </span>
                  <button
                    onClick={() => handleToggleWishlist(item)}
                    class="absolute top-1/2 -translate-y-1/2 right-2 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
