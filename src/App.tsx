import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Calendar, Image, LayoutDashboard, Compass, UtensilsCrossed, Star } from 'lucide-react';

// Views
import HeroView from './components/HeroView';
import MenuView from './components/MenuView';
import ReservationView from './components/ReservationView';
import GalleryView from './components/GalleryView';
import AdminDashboardView from './components/AdminDashboardView';
import AISommelierBot from './components/AISommelierBot';

export default function App() {
  const [activeTab, setActiveTab] = useState<'experience' | 'menu' | 'booking' | 'gallery' | 'admin'>('experience');

  // Booking states forwarded from Hero quick reservation card
  const [bookingDate, setBookingDate] = useState('2026-06-25');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingTime, setBookingTime] = useState('19:00');

  // AI assistant integration helper: Auto-opens Chat with a custom greeting
  const [triggerCount, setTriggerCount] = useState(0);

  const handleSuggestWinePairing = (dishName: string) => {
    // Select the AI bot window and send query
    const botInput = document.getElementById('ai-chat-input') as HTMLInputElement;
    const botToggle = document.getElementById('ai-toggle-btn') as HTMLButtonElement;
    
    // Switch on chatbot if closed
    if (botToggle) {
      botToggle.click();
    }

    setTimeout(() => {
      const activeInput = document.getElementById('ai-chat-input') as HTMLInputElement;
      if (activeInput) {
        activeInput.value = `Pairing suggestions for: ${dishName}`;
        activeInput.focus();
        
        // Find send button next to input and trigger
        const sendBtn = activeInput.nextElementSibling as HTMLButtonElement;
        if (sendBtn) {
          sendBtn.click();
        }
      }
    }, 400);
  };

  const menuTabs = [
    { id: 'experience', label: 'The Experience', icon: <Compass class="w-4 h-4" /> },
    { id: 'menu', label: 'Seasonal Menu', icon: <UtensilsCrossed class="w-4 h-4" /> },
    { id: 'booking', label: 'Reservations', icon: <Calendar class="w-4 h-4" /> },
    { id: 'gallery', label: 'Visual Odyssey', icon: <Image class="w-4 h-4" /> },
    { id: 'admin', label: 'Admin Dashboard', icon: <LayoutDashboard class="w-4 h-4" /> }
  ];

  return (
    <div id="gourmet-app" class="min-h-screen bg-[#0A0A0B] text-[#E5E5E5] flex flex-col font-sans relative antialiased selection:bg-[#C5A059]/30 selection:text-[#C5A059]">
      
      {/* 1. Global Glassmorphic Header */}
      <header class="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo GOURMET */}
          <button
            onClick={() => setActiveTab('experience')}
            class="flex items-center gap-2 group cursor-pointer"
          >
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#8E6E3A] flex items-center justify-center border border-white/10">
              <Star class="w-4.5 h-4.5 text-black fill-current animate-pulse" />
            </div>
            <div>
              <span class="font-display text-lg tracking-[0.25em] font-medium text-white uppercase block leading-none">GOURMET</span>
              <span class="text-[8px] font-mono tracking-widest text-[#C5A059] uppercase block mt-1">MICHELIN THREE-STAR DINING</span>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav class="hidden md:flex items-center gap-1.5 bg-white/5 p-1.5 rounded-full border border-white/10">
            {menuTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                class={`flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all font-display font-medium tracking-wide cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#C5A059] text-black shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Reserve CTA button */}
          <button
            onClick={() => setActiveTab('booking')}
            class="hidden lg:flex items-center gap-2 border border-white/20 hover:border-[#C5A059]/50 bg-white/5 hover:bg-[#C5A059]/10 text-[#C5A059] font-display font-medium px-5 py-2.5 rounded-xl text-xs tracking-wider transition-all cursor-pointer"
          >
            <span>Book Table</span>
          </button>
        </div>
      </header>

      {/* 2. Responsive Bottom/Grid Navigation (Mobile) */}
      <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-lg border-t border-white/10 px-4 py-3 flex items-center justify-around">
        {menuTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            class={`flex flex-col items-center gap-1 text-[10px] uppercase font-mono tracking-widest transition-colors ${
              activeTab === tab.id ? 'text-[#C5A059]' : 'text-white/40'
            }`}
          >
            {tab.icon}
            <span class="text-[8px] scale-90">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* 3. Main Viewport Container */}
      <main class="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            class="min-h-[calc(100vh-5rem)]"
          >
            {activeTab === 'experience' && (
              <HeroView
                onNavigateToBooking={(date, guests, time) => {
                  setBookingDate(date);
                  setBookingGuests(guests);
                  setBookingTime(time);
                  setActiveTab('booking');
                }}
                onNavigateToMenu={() => setActiveTab('menu')}
              />
            )}

            {activeTab === 'menu' && (
              <MenuView onSuggestWinePairing={handleSuggestWinePairing} />
            )}

            {activeTab === 'booking' && (
              <ReservationView
                initialDate={bookingDate}
                initialGuests={bookingGuests}
                initialTime={bookingTime}
                onBookingSuccess={() => setActiveTab('experience')}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryView />
            )}

            {activeTab === 'admin' && (
              <AdminDashboardView />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Global Floating Sommelier Assistant */}
      <AISommelierBot />

      {/* Space spacer for Mobile bottom menu padding */}
      <div class="h-16 md:hidden"></div>

      {/* 5. Luxury Footer */}
      <footer class="bg-[#0A0A0B] border-t border-white/5 py-12 px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-[#E5E5E5]/50 text-xs text-light">
          <div>
            <h4 class="font-display text-white tracking-widest uppercase mb-3">GOURMET PARIS &bull; MILANO</h4>
            <p class="leading-relaxed font-sans">
              Three-starred culinary coordination matching classical fundamentals with futuristic sensory pairings.
            </p>
          </div>
          <div class="space-y-1.5 font-mono">
            <h4 class="font-display text-white tracking-widest uppercase mb-3 font-semi-bold">Tasting Hours</h4>
            <p>&bull; Wednesday — Sunday: 5:00 PM — 11:30 PM</p>
            <p>&bull; Executive Cellar bookings require 48h notice</p>
          </div>
          <div>
            <h4 class="font-display text-white tracking-widest uppercase mb-3 font-semi-bold">Legal coordinates</h4>
            <p class="leading-relaxed">&copy; 2026 GOURMET Int. All rights reserved. Registered Relais &amp; Châteaux member.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
