import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, UtensilsCrossed, Calendar, Tag, Image, Mail, Settings, LogOut, Star,
} from 'lucide-react';

const adminLinks = [
  { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/admin/menu', label: 'Menu', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { path: '/admin/reservations', label: 'Reservations', icon: <Calendar className="w-4 h-4" /> },
  { path: '/admin/promotions', label: 'Promotions', icon: <Tag className="w-4 h-4" /> },
  { path: '/admin/gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
  { path: '/admin/contacts', label: 'Messages', icon: <Mail className="w-4 h-4" /> },
  { path: '/admin/profile', label: 'Profile', icon: <Settings className="w-4 h-4" /> },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E5E5E5] flex font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-60 bg-[#111113] border-r border-white/5 flex flex-col shrink-0 fixed h-full z-30">
        <Link to="/admin" className="px-5 py-5 border-b border-white/5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#8E6E3A] flex items-center justify-center">
            <Star className="w-4 h-4 text-black fill-current" />
          </div>
          <div>
            <span className="font-display text-sm tracking-[0.2em] font-medium text-white uppercase block">GOURMET</span>
            <span className="text-[7px] font-mono tracking-widest text-[#C5A059] uppercase block">ADMIN PANEL</span>
          </div>
        </Link>

        <nav className="flex-grow py-4 space-y-1 px-3 overflow-y-auto">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all ${
                location.pathname === link.path
                  ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {link.icon}
              <span className="font-display font-medium tracking-wide">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/5 p-4 space-y-3">
          <div className="text-xs text-white/40 font-mono">
            <span className="text-[#C5A059]">{user?.name || 'Admin'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-rose-400 transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
          <Link to="/" className="block text-[10px] text-white/30 hover:text-[#C5A059] font-mono">
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-grow ml-60">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
