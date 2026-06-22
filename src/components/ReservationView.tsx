import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, Landmark, AlertCircle, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { Reservation } from '../types';

interface ReservationViewProps {
  initialDate?: string;
  initialGuests?: number;
  initialTime?: string;
  onBookingSuccess: () => void;
}

interface SalonZone {
  id: string;
  name: string;
  capacityText: string;
  description: string;
  image: string;
  notes: string;
}

export default function ReservationView({
  initialDate = '2026-06-25',
  initialGuests = 2,
  initialTime = '19:00',
  onBookingSuccess
}: ReservationViewProps) {
  // Booking Form Fields
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [guestsCount, setGuestsCount] = useState(initialGuests);
  const [specialRequests, setSpecialRequests] = useState('');
  const [addPeanutAllergy, setAddPeanutAllergy] = useState(false);
  const [addGlutenAllergy, setAddGlutenAllergy] = useState(false);

  // Salon Zones
  const salonZones: SalonZone[] = [
    {
      id: 'salon-1',
      name: 'Salon Brass Utama',
      capacityText: 'Ideal untuk 2 hingga 6 tamu',
      description: 'Makan malam di salon utama kami yang dihiasi chandelier kuningan bercahaya, bangku beludru mewah, dan langit-langit tinggi peredam suara.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjP-RHsBe75Y_K_Duh5yeOla5OrcAwPfbomxrJJpibOx8AS7UH31WD4RcdfwemXRvT9jWG8pCGn_e1uzHboYMIUXL13r_3sOztuDqGw556W4EdHr3hekIXsjNuAkeAXdaGi09IL74Jn0XXXmOYqrKqKEhSg5COcKNfgGrl00LafxLDF5gyWZsn5BGYTDmtjAhWXpwPOcq-sgam8GaBjLi765uQi9-lcI96FtprTIRsCoQBKo7AO4EkaeJFMhaOMquE7Gg1ZfxmNq1P',
      notes: 'Termasuk padanan multi-sajian musiman standar.'
    },
    {
      id: 'salon-2',
      name: 'Konter Chef Eleanor',
      capacityText: 'Untuk 1 atau 2 tamu',
      description: 'Tempat duduk eksklusif di konter menghadap dapur terbuka kami. Saksikan koreografi kuliner dan dapatkan pelayanan langsung dari Chef Eleanor Vance.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvriSxtPLExBTEbGXNc8xNIgEHyQkkp98-BP0Nj9ApJPFUcaNkneFuwhs8jpcdLxpeVAL3yNkiJfhqmNJqfGHk58qJVs6xaF0ATy-fjMugE0J1EoTsw_KyUpuyajAcw74RnJiVjZk39Pz0qjm42g6LbavRzYU0Yd4xiQRDNgDV5ywQRGuJ7n0kXa2lZsly7Q0UuSRv4qpdL7oOu7j_hyhx2TT1pUHA-3Dk_5Y6Ut0Jzq8vAYpmRUO_eTrLuM6S-8fMaQyXXh6mmQZp',
      notes: 'Menu mikro-padanan 14 sajian eksklusif.'
    },
    {
      id: 'salon-3',
      name: 'Ruang Bawah Tanah Anggur',
      capacityText: 'Rombongan eksekutif hingga 12 tamu',
      description: 'Ruang makan bata berkubah bawah tanah. Nikmati hidangan dikelilingi koleksi sepuluh ribu anggur langka dan pengaturan pencicipan premium.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLTmc5HgnCABJQqUQycI3zBatcMP3vV7GPgUxw5eCjXEbJacOq8Z1sZSh6p0okrFok-rz2WRpUJ6wTRHoS2vNxo5IHMg7BuFzG-gAvYKdTIVVbPMGBJu9ngm2v3hEjiOyqD1gRSlVnf5UAdE62dmw2UvH4euCBrM-2TcPQ5ucG346-lG1cz6GtJjCRDMx7hbVb5n9j0BwyXotwnmmN40ztU36mWp_jc2t-pJQlKlut3pcBwN3cgLm8NwHHU8aeprOuwHS9GuROFTAQ',
      notes: 'Memerlukan koordinasi dengan Sommelier Utama.'
    }
  ];

  const [activeZone, setActiveZone] = useState<SalonZone>(salonZones[0]);
  const [submitting, setSubmitting] = useState(false);
  const [successReservation, setSuccessReservation] = useState<Reservation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !email.trim() || !phone.trim()) {
      alert("Tamu terhormat, mohon lengkapi semua data yang diperlukan sebelum melanjutkan.");
      return;
    }

    setSubmitting(true);

    const allergyNotes: string[] = [];
    if (addPeanutAllergy) allergyNotes.push("ALERGI KACANG BERAT");
    if (addGlutenAllergy) allergyNotes.push("Bebas Gluten (Celiac)");
    const combinedRequests = [specialRequests, ...allergyNotes].filter(Boolean).join(" • ");

    const body = {
      userName,
      email,
      phone,
      date,
      time,
      guestsCount,
      specialRequests: combinedRequests || undefined,
      status: 'Confirmed' // default confirms for premium feel
    };

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const data = await res.json();
        setSuccessReservation(data);
        // Clear forms
        setUserName('');
        setEmail('');
        setPhone('');
        setSpecialRequests('');
        setAddPeanutAllergy(false);
        setAddGlutenAllergy(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="booking-view" class="font-sans text-[#E5E5E5] pb-24 pt-8">
      <div class="max-w-7xl mx-auto px-6">
        
        {/* Banner title */}
        <div class="max-w-2xl mb-12">
          <span class="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium block mb-2">Kemewahan Atmosferik</span>
          <h2 class="font-display font-light text-4xl text-white tracking-tight">Reservasi Meja</h2>
          <p class="text-[#E5E5E5]/50 text-xs mt-1.5 leading-relaxed font-light font-sans">
            Pesan tempat duduk Anda. Pilih dari Salon Brass Utama kami, saksikan api dari konter Chef, atau amankan pengalaman ruang eksekutif.
          </p>
        </div>

        {/* double column wrapper layout */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (Salon Switcher and Image Preview) */}
          <div class="lg:col-span-12 xl:col-span-5 space-y-6">
            <span class="text-[10px] uppercase tracking-widest font-mono text-zinc-500 block mb-1">1. Pilih Lingkungan Salon</span>
            
            {/* Salon Buttons */}
            <div class="grid grid-cols-1 gap-3">
              {salonZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone)}
                  class={`p-4 text-left rounded-sm border transition-all flex flex-col gap-1.5 cursor-pointer ${
                    activeZone.id === zone.id
                      ? 'bg-[#C5A059]/10 border-[#C5A059]/50 text-[#C5A059]'
                      : 'bg-white/5 border-white/5 hover:border-white/10 text-[#E5E5E5]/50'
                  }`}
                >
                  <span class="font-display font-medium text-sm text-zinc-100">{zone.name}</span>
                  <span class="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">{zone.capacityText}</span>
                </button>
              ))}
            </div>

            {/* Immersive Image Panel */}
            <div class="bg-white/[0.02] border border-white/5 p-4 rounded-sm space-y-4">
              <div class="relative h-64 overflow-hidden rounded-sm bg-zinc-950">
                <img
                  src={activeZone.image}
                  alt={activeZone.name}
                  class="w-full h-full object-cover grayscale brightness-90 saturate-75"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/90 to-transparent"></div>
                <div class="absolute bottom-4 left-4">
                  <span class="bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    {activeZone.notes}
                  </span>
                </div>
              </div>
              <div>
                <h4 class="font-display text-sm font-semibold text-white">{activeZone.name}</h4>
                <p class="text-xs text-[#E5E5E5]/60 leading-relaxed font-sans mt-2 font-light">{activeZone.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column (Secure Booking details card) */}
          <div class="lg:col-span-12 xl:col-span-7">
            <div class="bg-white/[0.01] border border-white/5 rounded-sm p-6 md:p-8 relative">
              <span class="text-[10px] uppercase tracking-widest font-mono text-zinc-500 block mb-6">2. Detail Informasi Tamu</span>
              
              <form onSubmit={handleSubmit} class="space-y-6">
                
                {/* Guest Details Row */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="space-y-1.5 text-left">
                    <label class="text-[10px] font-mono text-[#E5E5E5]/40 uppercase tracking-widest">Nama Lengkap *</label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      placeholder="contoh: Eleanor Vance"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      class="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-sm p-3.5 font-sans transition-all"
                    />
                  </div>
                  <div class="space-y-1.5 text-left">
                    <label class="text-[10px] font-mono text-[#E5E5E5]/40 uppercase tracking-widest">Alamat Email *</label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      placeholder="eleanor@gourmet.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      class="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-sm p-3.5 font-sans transition-all"
                    />
                  </div>
                </div>

                {/* Contacts details row */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="space-y-1.5 text-left">
                    <label class="text-[10px] font-mono text-[#E5E5E5]/40 uppercase tracking-widest">Nomor Telepon *</label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      placeholder="+62 812 3456 7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      class="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-sm p-3.5 font-sans transition-all"
                    />
                  </div>
                  <div class="space-y-1.5 text-left">
                    <label class="text-[10px] font-mono text-[#E5E5E5]/40 uppercase tracking-widest">Area Salon Aktif</label>
                    <input
                      type="text"
                      disabled
                      value={activeZone.name}
                      class="w-full bg-white/5 border border-white/5 text-[#C5A059] font-mono text-xs rounded-sm p-3.5"
                    />
                  </div>
                </div>

                {/* Seating coordinates row */}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0A0A0B] p-4 rounded-sm border border-white/10">
                  <div class="space-y-1 flex flex-col justify-center">
                    <label class="text-[9px] font-mono text-white/40 uppercase tracking-widest">Tanggal</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      class="w-full bg-transparent outline-none text-xs text-zinc-100 font-sans cursor-pointer"
                    />
                  </div>
                  <div class="space-y-1 flex flex-col justify-center">
                    <label class="text-[9px] font-mono text-white/40 uppercase tracking-widest">Jam Makan</label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      class="w-full bg-transparent outline-none text-xs text-zinc-100 font-sans cursor-pointer"
                    >
                      {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((timeStr) => (
                        <option key={timeStr} value={timeStr} class="bg-[#0A0A0B]">{timeStr}</option>
                      ))}
                    </select>
                  </div>
                  <div class="space-y-1 flex flex-col justify-center">
                    <label class="text-[9px] font-mono text-white/40 uppercase tracking-widest">Jumlah Tamu</label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      class="w-full bg-transparent outline-none text-xs text-zinc-100 font-sans cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                        <option key={num} value={num} class="bg-[#0A0A0B]">{num} Tamu</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Allergen check */}
                <div class="space-y-2.5">
                  <span class="text-[10px] font-mono text-[#E5E5E5]/40 uppercase tracking-widest block">Informasi Kesehatan</span>
                  <div class="flex flex-col sm:flex-row gap-4">
                    <label class="flex items-center gap-2.5 bg-[#0A0A0B] p-3 rounded-sm border border-white/5 cursor-pointer text-xs select-none flex-grow">
                      <input
                        type="checkbox"
                        checked={addPeanutAllergy}
                        onChange={(e) => setAddPeanutAllergy(e.target.checked)}
                        class="accent-[#C5A059] w-3.5 h-3.5"
                      />
                      <span class="text-white/60">Alergi Kacang Berat</span>
                    </label>
                    <label class="flex items-center gap-2.5 bg-[#0A0A0B] p-3 rounded-sm border border-white/5 cursor-pointer text-xs select-none flex-grow">
                      <input
                        type="checkbox"
                        checked={addGlutenAllergy}
                        onChange={(e) => setAddGlutenAllergy(e.target.checked)}
                        class="accent-[#C5A059] w-3.5 h-3.5"
                      />
                      <span class="text-white/60">Celiac / Bebas Gluten</span>
                    </label>
                  </div>
                </div>

                {/* Special Requests */}
                <div class="space-y-1.5 text-left">
                  <label class="text-[10px] font-mono text-[#E5E5E5]/40 uppercase tracking-widest">Permintaan Khusus / Preferensi Diet</label>
                  <textarea
                    rows={3}
                    placeholder="Merayakan ulang tahun pernikahan, preferensi ruang privat, padanan vegan..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    class="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-[#E5E5E5] rounded-sm p-3.5 font-sans transition-all resize-none"
                  ></textarea>
                </div>

                <div class="flex items-center gap-3 bg-[#C5A059]/[0.02] border border-[#C5A059]/10 p-4 rounded-sm">
                  <AlertCircle class="w-4 h-4 text-[#C5A059] shrink-0" />
                  <p class="text-[10px] text-white/50 leading-relaxed font-sans">
                    <strong>Catatan:</strong> Meja akan ditahan selama 15 menit masa tenggang. Pembatalan dapat dikomunikasikan langsung melalui asisten Sommelier kami.
                  </p>
                </div>

                <button
                  id="booking-submit-btn"
                  type="submit"
                  disabled={submitting}
                  class="w-full bg-[#C5A059] hover:bg-[#8E6E3A] disabled:opacity-50 text-black font-display font-medium tracking-[0.25em] uppercase text-[10px] py-4.5 rounded-sm border border-[#C5A059]/10 transition-all duration-300 cursor-pointer"
                >
                  {submitting ? 'MEMVALIDASI TEMPAT DUDUK...' : 'KONFIRMASI RESERVASI SEKARANG'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Success Modal */}
      <AnimatePresence>
        {successReservation && (
          <motion.div
            id="success-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            class="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              class="w-full max-w-xl bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative text-center space-y-6"
            >
              <div class="w-16 h-16 rounded-sm bg-[#C5A059]/10 border border-[#C5A059]/35 flex items-center justify-center mx-auto">
                <CheckCircle2 class="w-8 h-8 text-[#C5A059]" />
              </div>

              <div class="space-y-2">
                <h3 class="font-display font-light text-2xl md:text-3xl text-zinc-100 tracking-tight">Reservasi Berhasil</h3>
                <p class="text-[#C5A059] font-mono text-[9px] uppercase tracking-[0.2em] font-medium">STATUS TERKONFIRMASI BINTANG MICHELIN</p>
              </div>

              {/* Booking Summary Card */}
              <div class="bg-[#0A0A0B] border border-white/5 p-5 rounded-sm text-left space-y-4">
                <div class="border-b border-white/5 pb-3 flex items-center justify-between">
                  <div>
                    <p class="text-[9px] text-[#E5E5E5]/45 font-mono uppercase tracking-wider">Nama Tamu</p>
                    <p class="text-xs text-zinc-100 font-display font-medium">{successReservation.userName}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[9px] text-[#E5E5E5]/45 font-mono uppercase tracking-wider">Kode Reservasi</p>
                    <p class="text-xs text-[#C5A059] font-mono font-medium">{successReservation.id}</p>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2.5 text-xs text-[#E5E5E5]/60">
                  <div>
                    <span class="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Tanggal</span>
                    <span class="text-zinc-200 font-medium font-mono text-[11px]">{successReservation.date}</span>
                  </div>
                  <div>
                    <span class="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Jam</span>
                    <span class="text-zinc-200 font-medium font-mono text-[11px]">{successReservation.time}</span>
                  </div>
                  <div>
                    <span class="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Jumlah Tamu</span>
                    <span class="text-zinc-200 font-medium font-mono text-[11px]">{successReservation.guestsCount} Tamu</span>
                  </div>
                </div>

                <div>
                  <span class="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Lingkungan Salon</span>
                  <span class="text-xs text-[#C5A059] font-display">{activeZone.name}</span>
                </div>

                {successReservation.specialRequests && (
                  <div class="border-t border-white/5 pt-3.5">
                    <span class="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Alergi &amp; Permintaan Khusus</span>
                    <span class="text-[11px] text-[#E5E5E5]/50 italic block font-light font-sans">{successReservation.specialRequests}</span>
                  </div>
                )}
              </div>

              <div class="pt-2">
                <button
                  onClick={() => {
                    setSuccessReservation(null);
                    onBookingSuccess();
                  }}
                  class="bg-white hover:bg-white/90 text-black font-display font-medium text-[10px] uppercase tracking-wider py-3 px-8 rounded-sm transition-colors cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
