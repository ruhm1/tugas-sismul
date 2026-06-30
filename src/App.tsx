import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { BgmProvider } from './hooks/useBgm';
import Toast from './components/Toast';
import BgmControl from './components/BgmControl';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import HeroView from './components/HeroView';
import MenuView from './components/MenuView';
import ReservationView from './components/ReservationView';
import GalleryView from './components/GalleryView';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PromotionsPage from './pages/PromotionsPage';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminReservationPage from './pages/admin/AdminReservationPage';
import AdminPromoPage from './pages/admin/AdminPromoPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminContactPage from './pages/admin/AdminContactPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// Wrapper for HeroView to pass navigation props
function HomePage() {
  const navigate = useNavigate();
  return (
    <HeroView 
      onNavigateToBooking={(date, guests, time) => navigate('/reservation', { state: { date, guests, time } })} 
      onNavigateToMenu={() => navigate('/menu')} 
    />
  );
}

// Wrapper for MenuView
function MenuPage() {
  return <MenuView onSuggestWinePairing={() => {}} />;
}

// Wrapper for ReservationView
function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { date?: string, guests?: number, time?: string } | null;
  
  return (
    <ReservationView 
      initialDate={state?.date}
      initialGuests={state?.guests}
      initialTime={state?.time}
      onBookingSuccess={() => navigate('/')} 
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BgmProvider>
        <BgmControl />
        <BrowserRouter>
          <Toast />
          <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/gallery" element={<GalleryView />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Admin login (no layout) */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/menu" element={<AdminMenuPage />} />
              <Route path="/admin/reservations" element={<AdminReservationPage />} />
              <Route path="/admin/promotions" element={<AdminPromoPage />} />
              <Route path="/admin/gallery" element={<AdminGalleryPage />} />
              <Route path="/admin/contacts" element={<AdminContactPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BgmProvider>
    </AuthProvider>
  );
}
