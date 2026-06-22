import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Star, Compass, UtensilsCrossed, Calendar, Image, Phone, Tag, Info, LayoutDashboard, Sparkles } from 'lucide-react';
import AISommelierBot from '../components/AISommelierBot';

const navLinks = [
  { path: '/', label: 'Beranda', icon: <Compass className="w-4 h-4" /> },
  { path: '/about', label: 'Tentang', icon: <Info className="w-4 h-4" /> },
  { path: '/menu', label: 'Menu', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { path: '/promotions', label: 'Promo', icon: <Tag className="w-4 h-4" /> },
  { path: '/gallery', label: 'Galeri', icon: <Image className="w-4 h-4" /> },
  { path: '/reservation', label: 'Reservasi', icon: <Calendar className="w-4 h-4" /> },
  { path: '/contact', label: 'Kontak', icon: <Phone className="w-4 h-4" /> },
];

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E5E5E5] flex flex-col font-sans relative antialiased selection:bg-[#C5A059]/30 selection:text-[#C5A059]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#8E6E3A] flex items-center justify-center border border-white/10">
              <Star className="w-4.5 h-4.5 text-black fill-current" />
            </div>
            <div>
              <span className="font-display text-lg tracking-[0.25em] font-medium text-white uppercase block leading-none">GOURMET</span>
              <span className="text-[8px] font-mono tracking-widest text-[#C5A059] uppercase block mt-1">RESTORAN BINTANG TIGA MICHELIN</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 bg-white/5 p-1.5 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs transition-all font-display font-medium tracking-wide ${
                  location.pathname === link.path
                    ? 'bg-[#C5A059] text-black shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <Link
            to="/reservation"
            className="hidden lg:flex items-center gap-2 border border-white/20 hover:border-[#C5A059]/50 bg-white/5 hover:bg-[#C5A059]/10 text-[#C5A059] font-display font-medium px-5 py-2.5 rounded-xl text-xs tracking-wider transition-all"
          >
            Pesan Meja
          </Link>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-lg border-t border-white/10 px-2 py-2 flex items-center justify-around">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-0.5 text-[8px] uppercase font-mono tracking-wider transition-colors ${
              location.pathname === link.path ? 'text-[#C5A059]' : 'text-white/40'
            }`}
          >
            {link.icon}
            <span className="scale-75">{link.label.slice(0, 6)}</span>
          </Link>
        ))}
        <Link
          to="/admin/login"
          className={`flex flex-col items-center gap-0.5 text-[8px] uppercase font-mono tracking-wider transition-colors ${
            location.pathname.startsWith('/admin') ? 'text-[#C5A059]' : 'text-white/40'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="scale-75">Admin</span>
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* AI Chatbot */}
      <AISommelierBot />

      {/* Mobile bottom spacer */}
      <div className="h-16 md:hidden" />

      {/* Footer */}
      <footer className="bg-[#0A0A0B] border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-[#E5E5E5]/50 text-xs">
          <div>
            <h4 className="font-display text-white tracking-widest uppercase mb-3">GOURMET</h4>
            <p className="leading-relaxed font-sans">
              Keunggulan kuliner bintang tiga yang memadukan fundamental klasik dengan paduan sensorik futuristik.
            </p>
          </div>
          <div className="space-y-1.5 font-mono">
            <h4 className="font-display text-white tracking-widest uppercase mb-3 font-semibold">Jam Operasional</h4>
            <p>Rabu - Minggu: 17.00 - 23.30</p>
            <p>Reservasi Ruang Eksekutif memerlukan pemberitahuan 48 jam</p>
          </div>
          <div>
            <h4 className="font-display text-white tracking-widest uppercase mb-3 font-semibold">Kontak</h4>
            <p className="leading-relaxed">12 Rue de la Gastronomie, Paris 75008</p>
            <p>+33 1 42 68 53 00 | reservations@gourmet.com</p>
            <p className="mt-2">&copy; 2026 GOURMET. Hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
