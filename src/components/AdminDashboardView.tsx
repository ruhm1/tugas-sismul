import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Calendar, Users, DollarSign, ChefHat,
  Trash2, Edit, Plus, Check, X, AlertCircle, RefreshCw, BarChart2, Star
} from 'lucide-react';
import { Reservation, MenuItem } from '../types';

export default function AdminDashboardView() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding/Editing Menu Items
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuCategory, setMenuCategory] = useState<'Appetizers' | 'Mains' | 'Desserts' | 'Wines'>('Mains');
  const [menuTags, setMenuTags] = useState('');
  const [menuIsSignature, setMenuIsSignature] = useState(false);
  const [menuImage, setMenuImage] = useState('');

  // AI Insights State
  const [aiInsight, setAiInsight] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resRes, menuRes] = await Promise.all([
        fetch('/api/reservations'),
        fetch('/api/menu')
      ]);
      const resData = await resRes.json();
      const menuData = await menuRes.json();
      setReservations(resData);
      setMenuItems(menuData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update reservation status via PUT
  const handleChangeStatus = async (id: string, newStatus: 'Confirmed' | 'Pending' | 'Cancelled') => {
    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setReservations(prev =>
          prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add new menu item via POST
  const handleAddMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArr = menuTags.split(',').map(x => x.trim()).filter(Boolean);
    const body = {
      name: menuName,
      price: Number(menuPrice) || 20,
      description: menuDesc,
      category: menuCategory,
      tags: tagsArr,
      isSignature: menuIsSignature,
      image: menuImage || undefined
    };

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        await fetchAdminData();
        // Reset and close
        setShowAddModal(false);
        setMenuName('');
        setMenuPrice('');
        setMenuDesc('');
        setMenuTags('');
        setMenuIsSignature(false);
        setMenuImage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit menu item via PUT
  const handleEditMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    const tagsArr = menuTags.split(',').map(x => x.trim()).filter(Boolean);
    const body = {
      name: menuName,
      price: Number(menuPrice) || 20,
      description: menuDesc,
      category: menuCategory,
      tags: tagsArr,
      isSignature: menuIsSignature,
      image: menuImage || undefined
    };

    try {
      const res = await fetch(`/api/menu/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        await fetchAdminData();
        // Reset and close
        setEditItem(null);
        setMenuName('');
        setMenuPrice('');
        setMenuDesc('');
        setMenuTags('');
        setMenuIsSignature(false);
        setMenuImage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete menu item via DELETE
  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Are you positive you wish to remove this culinary artifact?")) return;
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMenuItems(prev => prev.filter(x => x.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Modal Helper
  const openEditModal = (item: MenuItem) => {
    setEditItem(item);
    setMenuName(item.name);
    setMenuPrice(String(item.price));
    setMenuDesc(item.description);
    setMenuCategory(item.category);
    setMenuTags(item.tags.join(', '));
    setMenuIsSignature(!!item.isSignature);
    setMenuImage(item.image);
  };

  // Run AI Insight analysis on current reservations
  const generateAIInsights = async () => {
    setAnalyzing(true);
    setAiInsight('');
    try {
      // Craft a short query
      const prompt = `Review this current GOURMET reservation table:
${JSON.stringify(reservations.map(r => ({ guest: r.userName, size: r.guestsCount, requests: r.specialRequests, time: r.time, date: r.date })))}
Make a sophisticated michelin-star chef analysis of what inventory prep needs to occur (Wagyu pieces, champagne levels, severe nut-allergic protections, gold leaves). Give me 3 bullet points with elegant direct advice. Format beautifully, no technical jargon.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      const data = await res.json();
      setAiInsight(data.text);
    } catch (err) {
      console.error(err);
      setAiInsight("Unable to connect to culinary cellar insight. Rest assured our kitchen squad is ready on hot standby.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Stats computations
  const totalGuests = reservations.filter(r => r.status === 'Confirmed').reduce((sum, x) => sum + x.guestsCount, 0);
  const projectedRevenue = reservations.filter(r => r.status === 'Confirmed').reduce((sum, x) => sum + (x.guestsCount * 95), 0); // approx $95 spend per guest

  return (
    <div id="admin-dashboard-view" class="font-sans text-zinc-100 pb-24 pt-8">
      <div class="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Dashboard Title header row */}
        <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div>
            <span class="text-[10px] uppercase tracking-[0.25em] font-mono text-amber-500 font-semibold block mb-2 font-display">Administrative Panel</span>
            <h2 class="font-display font-light text-4xl text-white tracking-tight">Gourmet Command Center</h2>
            <p class="text-zinc-500 text-xs mt-1">
              Verify client bookings, modify dining listings, set allergies guidelines, and retrieve real-time cellar coordination metrics.
            </p>
          </div>
          <button
            onClick={fetchAdminData}
            class="flex items-center gap-1.5 text-xs text-amber-400 border border-amber-500/20 bg-amber-500/[0.04] hover:bg-amber-500/[0.08] px-4 py-2.5 rounded-xl transition-all cursor-pointer select-none shrink-0"
          >
            <RefreshCw class="w-3.5 h-3.5" />
            <span>Resync Database</span>
          </button>
        </div>

        {/* 1. KPI cards row */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 flex items-center justify-between shadow-md">
            <div>
              <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Bookings</p>
              <h3 class="font-display font-bold text-2xl text-zinc-100 mt-1">{reservations.length} Tables</h3>
              <p class="text-[10px] text-zinc-400 font-mono mt-1">&bull; {reservations.filter(x => x.status === 'Confirmed').length} Confirmed Seats</p>
            </div>
            <div class="w-11 h-11 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center text-amber-400">
              <Calendar class="w-5 h-5" />
            </div>
          </div>

          <div class="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 flex items-center justify-between shadow-md">
            <div>
              <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Projected Revenue</p>
              <h3 class="font-display font-bold text-2xl text-zinc-100 mt-1">${projectedRevenue.toLocaleString()}</h3>
              <p class="text-[10px] text-zinc-400 font-mono mt-1">&bull; Based on $95 average guest spend</p>
            </div>
            <div class="w-11 h-11 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center text-amber-400">
              <DollarSign class="w-5 h-5" />
            </div>
          </div>

          <div class="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 flex items-center justify-between shadow-md">
            <div>
              <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Menu Items</p>
              <h3 class="font-display font-bold text-2xl text-zinc-100 mt-1">{menuItems.length} Offerings</h3>
              <p class="text-[10px] text-zinc-400 font-mono mt-1">&bull; {menuItems.filter(x => x.isSignature).length} Signature Masterpieces</p>
            </div>
            <div class="w-11 h-11 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center text-amber-400">
              <ChefHat class="w-5 h-5" />
            </div>
          </div>

          <div class="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 flex items-center justify-between shadow-md">
            <div>
              <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Patrons</p>
              <h3 class="font-display font-bold text-2xl text-zinc-100 mt-1">{totalGuests} Guests</h3>
              <p class="text-[10px] text-zinc-400 font-mono mt-1">&bull; Booked on seasonal lounge</p>
            </div>
            <div class="w-11 h-11 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center text-amber-400">
              <Users class="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 2. Interactive AI insights generation panel */}
        <div class="bg-gradient-to-r from-amber-950/20 via-zinc-900/80 to-amber-950/20 border border-amber-900/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 shadow-xl">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-800 flex items-center justify-center shadow-lg text-zinc-100 shrink-0">
            <Sparkles class="w-5 h-5 animate-pulse" />
          </div>
          <div class="flex-grow space-y-4">
            <div>
              <h3 class="font-display text-lg text-amber-100 font-medium tracking-wide">AI Kitchen Prep Insights</h3>
              <p class="text-zinc-400 text-xs mt-1 leading-relaxed">
                Analyze active tables to forecast pre-preparation work, wine chillings, allergen alerts, and VIP preparations.
              </p>
            </div>

            {aiInsight ? (
              <div class="bg-zinc-950 p-5 rounded-xl border border-zinc-850 text-xs text-zinc-350 leading-relaxed font-sans whitespace-pre-line">
                {aiInsight}
              </div>
            ) : null}

            <div class="flex items-center gap-3">
              <button
                onClick={generateAIInsights}
                disabled={analyzing || reservations.length === 0}
                class="bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:opacity-40 text-zinc-950 font-display font-medium text-xs py-2.5 px-6 rounded-xl border border-amber-500/20 transition-all cursor-pointer"
              >
                {analyzing ? 'ANALYZING RESERVATIONS...' : 'Generate Kitchen Prep Advice'}
              </button>
              {reservations.length === 0 && (
                <span class="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                  <AlertCircle class="w-3.5 h-3.5 text-zinc-650" /> Secure a reservation first
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Live reservations editor table coordinate */}
        <div class="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 md:p-8 space-y-6">
          <div class="flex items-center justify-between border-b border-zinc-950 pb-4">
            <div>
              <h3 class="font-display text-lg font-medium text-zinc-100 tracking-wide">Live Restaurant Bookings</h3>
              <p class="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">REAL-TIME DATA PERSISTENCE</p>
            </div>
            <span class="text-xs text-zinc-400 font-mono tracking-wider">{reservations.length} Active Records</span>
          </div>

          {loading ? (
            <div class="py-12 flex justify-center">
              <div class="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reservations.length === 0 ? (
            <p class="text-zinc-500 text-xs italic text-center py-6">No reservations booked on target database.</p>
          ) : (
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-zinc-850 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    <th class="pb-3 pt-1">Guest / Contact</th>
                    <th class="pb-3 pt-1">Seating Time</th>
                    <th class="pb-3 pt-1">Parties</th>
                    <th class="pb-3 pt-1">Requests / Allergies</th>
                    <th class="pb-3 pt-1">Status Code</th>
                    <th class="pb-3 pt-1 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-950 text-xs">
                  {reservations.map((res) => (
                    <tr key={res.id} class="hover:bg-zinc-950/20 transition-colors">
                      <td class="py-4">
                        <div class="font-display font-medium text-zinc-100">{res.userName}</div>
                        <div class="text-[10px] text-zinc-500 font-mono mt-0.5">{res.email}</div>
                      </td>
                      <td class="py-4 font-mono font-medium text-zinc-100">
                        {res.date}
                        <span class="block text-[10px] text-amber-400 mt-0.5">{res.time} PM</span>
                      </td>
                      <td class="py-4 font-mono font-medium text-zinc-250">
                        {res.guestsCount} Guest{res.guestsCount === 1 ? '' : 's'}
                      </td>
                      <td class="py-4 max-w-xs text-zinc-400">
                        {res.specialRequests ? (
                          <span class="truncate block hover:whitespace-normal italic text-[11px]">
                            {res.specialRequests}
                          </span>
                        ) : (
                          <span class="text-zinc-600 font-mono text-[10px] italic">None</span>
                        )}
                      </td>
                      <td class="py-4">
                        <span class={`font-mono text-[10px] px-2.5 py-1 rounded font-semibold uppercase tracking-wider ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : res.status === 'Pending'
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td class="py-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleChangeStatus(res.id, 'Confirmed')}
                            title="Confirm Booking"
                            class="p-1.5 rounded-lg border border-zinc-800 hover:border-emerald-900 bg-zinc-950 text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <Check class="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleChangeStatus(res.id, 'Pending')}
                            title="Set Pending"
                            class="p-1.5 rounded-lg border border-zinc-800 hover:border-amber-900 bg-zinc-950 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <RefreshCw class="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleChangeStatus(res.id, 'Cancelled')}
                            title="Cancel Booking"
                            class="p-1.5 rounded-lg border border-zinc-800 hover:border-rose-900 bg-zinc-950 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <X class="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Menu Catalogue listing / Custom Editor CRUD */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Menu catalogue */}
          <div class="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 md:p-8 lg:col-span-8 space-y-6">
            <div class="flex items-center justify-between border-b border-zinc-950 pb-4">
              <div>
                <h3 class="font-display text-lg font-medium text-zinc-100 tracking-wide">Culinary Offering Catalog</h3>
                <p class="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">ADD &bull; EDIT &bull; REMOVE SELECTIONS</p>
              </div>
              <button
                onClick={() => {
                  setEditItem(null);
                  setShowAddModal(true);
                  // clear form registers
                  setMenuName('');
                  setMenuPrice('');
                  setMenuDesc('');
                  setMenuTags('');
                  setMenuIsSignature(false);
                  setMenuImage('');
                }}
                class="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-display tracking-wide font-medium text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus class="w-4 h-4 text-zinc-950" />
                <span>Publish Offering</span>
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-zinc-850 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    <TH class="pb-3">Culinary Item</TH>
                    <TH class="pb-3">Class</TH>
                    <TH class="pb-3">Bronze Valuation</TH>
                    <TH class="pb-3 text-right">Coordinate Action</TH>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-950 text-xs">
                  {menuItems.map((item) => (
                    <tr key={item.id} class="hover:bg-zinc-950/25 transition-colors">
                      <td class="py-3.5">
                        <div class="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            class="w-10 h-10 rounded-lg object-cover bg-zinc-950 border border-zinc-900"
                          />
                          <div>
                            <span class="font-display font-medium text-zinc-100 flex items-center gap-1.5">
                              {item.name}
                              {item.isSignature && <Star class="w-3 h-3 text-amber-400 fill-current" />}
                            </span>
                            <span class="text-[10px] text-zinc-500 block truncate max-w-xs">{item.description}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">{item.category}</td>
                      <td class="py-3.5 font-mono font-medium text-amber-400 text-sm">${item.price}</td>
                      <td class="py-3.5 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            class="p-1.5 rounded-lg border border-zinc-800 hover:border-amber-900 text-zinc-500 hover:text-amber-400 bg-zinc-950 cursor-pointer"
                          >
                            <Edit class="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id)}
                            class="p-1.5 rounded-lg border border-zinc-800 hover:border-rose-900 text-zinc-500 hover:text-rose-400 bg-zinc-950 cursor-pointer"
                          >
                            <Trash2 class="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Mini Guideline Info */}
          <div class="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 lg:col-span-4 space-y-4">
            <h4 class="font-display font-medium text-amber-100 text-sm">Fine Dining Inventory Advice</h4>
            <div class="text-xs text-zinc-400 space-y-3.5 leading-relaxed font-sans">
              <p>
                <strong>Michelin Quality Rule:</strong> Do not compromise plating names or descriptions. Any items posted here will synchronously populate GOURMET's seasonal dining catalog.
              </p>
              <div class="h-px bg-zinc-950"></div>
              <ul class="space-y-2 list-disc list-inside text-[11px] text-zinc-500 font-mono">
                <li>Appetizers should not outline mains.</li>
                <li>Tag options: GF, V, Organic.</li>
                <li>Validate wine years.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Modal Overlay for Adding or Modifying menu products */}
      <AnimatePresence>
        {(showAddModal || editItem) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            class="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              class="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative space-y-6"
            >
              {/* Close Button top */}
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditItem(null);
                }}
                class="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 p-1.5 hover:bg-zinc-800 rounded-lg transition-all cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>

              <div class="space-y-1">
                <h3 class="font-display font-light text-xl text-zinc-100 tracking-tight">
                  {editItem ? 'Modify Culinary Listing' : 'Publish New Masterpiece'}
                </h3>
                <p class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">SUBMITS LIVE UPDATE TO RESTAURANT CATALOG</p>
              </div>

              <form onSubmit={editItem ? handleEditMenuSubmit : handleAddMenuSubmit} class="space-y-4">
                <div class="space-y-1 text-left">
                  <label class="text-[9px] font-mono text-zinc-400 uppercase">Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crispy Toothfish"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/40 outline-none text-xs text-zinc-100 rounded-lg p-3 transition-all"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1 text-left">
                    <label class="text-[9px] font-mono text-zinc-400 uppercase">Class Tier</label>
                    <select
                      value={menuCategory}
                      onChange={(e) => setMenuCategory(e.target.value as any)}
                      class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/40 outline-none text-xs text-zinc-100 rounded-lg p-3 transition-all"
                    >
                      <option value="Appetizers">Appetizers</option>
                      <option value="Mains">Mains</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Wines">Wines</option>
                    </select>
                  </div>
                  <div class="space-y-1 text-left">
                    <label class="text-[9px] font-mono text-zinc-400 uppercase">Valuation ($ Price)*</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45"
                      value={menuPrice}
                      onChange={(e) => setMenuPrice(e.target.value)}
                      class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/40 outline-none text-xs text-zinc-100 rounded-lg p-3 transition-all"
                    />
                  </div>
                </div>

                <div class="space-y-1 text-left">
                  <label class="text-[9px] font-mono text-zinc-400 uppercase">Description narrative *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Butter poached sunchoke purees and elegant saffron lines..."
                    value={menuDesc}
                    onChange={(e) => setMenuDesc(e.target.value)}
                    class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/40 outline-none text-xs text-zinc-100 rounded-lg p-3 transition-all resize-none"
                  ></textarea>
                </div>

                <div class="space-y-1 text-left">
                  <label class="text-[9px] font-mono text-zinc-400 uppercase">Image Hotlink URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={menuImage}
                    onChange={(e) => setMenuImage(e.target.value)}
                    class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/40 outline-none text-xs text-zinc-100 rounded-lg p-3 transition-all"
                  />
                </div>

                <div class="space-y-1 text-left">
                  <label class="text-[9px] font-mono text-zinc-400 uppercase">Filters Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Signature, GF, V, Organic"
                    value={menuTags}
                    onChange={(e) => setMenuTags(e.target.value)}
                    class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/40 outline-none text-xs text-zinc-100 rounded-lg p-3 transition-all"
                  />
                </div>

                <div class="pt-2">
                  <label class="flex items-center gap-2.5 bg-zinc-950 p-3 rounded-lg border border-zinc-850 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={menuIsSignature}
                      onChange={(e) => setMenuIsSignature(e.target.checked)}
                      class="accent-amber-500 w-3.5 h-3.5"
                    />
                    <span class="text-zinc-300 font-medium font-mono text-[10px] uppercase">Gild with Signature Highlight</span>
                  </label>
                </div>

                <button
                  type="submit"
                  class="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-505 hover:to-amber-650 text-zinc-950 font-display font-medium text-xs tracking-wider py-3 px-8 rounded-lg transition-all mt-4 cursor-pointer"
                >
                  {editItem ? 'UPDATE CULINARY ARTIFACT' : 'PUBLISH ARTIFACT TO LOUNGE'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom sub-component helper representing stylized lowercase th tags
function TH({ children, class: cName = "" }: { children: React.ReactNode; class?: string }) {
  return <th class={`pb-3 pt-1 ${cName}`}>{children}</th>;
}
