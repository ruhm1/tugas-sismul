import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Users, Wine, Clock, Landmark, GlassWater } from 'lucide-react';

interface HeroViewProps {
  onNavigateToBooking: (date: string, guests: number, time: string) => void;
  onNavigateToMenu: () => void;
}

export default function HeroView({ onNavigateToBooking, onNavigateToMenu }: HeroViewProps) {
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [dateVal, setDateVal] = useState<string>('2026-06-25');
  const [timeVal, setTimeVal] = useState<string>('19:00');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToBooking(dateVal, guestsCount, timeVal);
  };

  return (
    <div id="hero-view-container" class="font-sans text-[#E5E5E5] pb-20">
      {/* Hero Section */}
      <div class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Hotlinked Image */}
        <div class="absolute inset-0 z-0">
          <img
            id="hero-bg-img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp9FIZCeC2CBRjG9-kdApBFpUD_W9Qr56iYZfyzIb2hsJ3I85egopDzqfsMap0qav-LQ08qBFxXa6Asoh0cKgoEaIUnm8mxx_VRGCyGq1dYI68ulm_Vd2RYRwhUkhokdMcWuyOImaEwxnIY_ueBb5T5PqYf4nH4gC9vFkng-SkqcreuMYKhbi--Xq0fdO0APQxNLeNtpavzLY8a9Ods7iFZnspDUMLMkUBX36kfqhI8Dd-rNi7qVIuEeXvN3sWpyxbiU6brMTywDie"
            alt="Ruang Makan GOURMET"
            class="w-full h-full object-cover filter brightness-[0.2] scale-105 transform transition duration-[15s]"
          />
          {/* Subtle Golden Vignette Overlay */}
          <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-[#0A0A0B]/80"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/40 via-transparent to-[#0A0A0B]/40"></div>
        </div>
 
        {/* Hero Content */}
        <div class="relative z-10 max-w-5xl mx-auto px-6 text-center pt-16 flex flex-col items-center">
          {/* Gold Star / Michelin Note */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            class="flex items-center gap-1.5 border border-[#C5A059]/30 bg-[#C5A059]/[0.05] px-4 py-2 rounded-full mb-6"
          >
            <span class="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium">
              Tiga Bintang Michelin &bull; Layanan Makan Privat
            </span>
          </motion.div>
 
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            class="font-display font-light text-5xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-none"
          >
            Keanggunan dalam <span class="text-[#C5A059] font-serif italic font-light">Setiap Sensasi</span>
          </motion.h1>
 
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            class="text-[#E5E5E5]/70 text-sm md:text-base max-w-2xl mb-12 font-sans font-light leading-relaxed tracking-wider"
          >
            Petualangan kuliner kontemporer yang dikurasi oleh Kepala Chef Eleanor Vance. Nikmati presisi artisanal, koleksi anggur legendaris, dan kemewahan atmosferik.
          </motion.p>
 
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            class="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <button
              onClick={onNavigateToMenu}
              class="group font-display tracking-[0.2em] font-medium text-[10px] uppercase bg-[#C5A059] hover:bg-[#8E6E3A] text-black px-8 py-4 rounded-sm border border-[#C5A059]/10 shadow-lg shadow-[#C5A059]/10 flex items-center justify-center gap-2 transition-all transition-colors duration-300"
            >
              Jelajahi Menu Musiman
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
            </button>
            <a
              href="#the-experience"
              class="font-display tracking-[0.2em] font-medium text-[10px] uppercase bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-sm border border-white/10 shadow-md transition-all flex items-center justify-center transition-colors duration-300"
            >
              Pengalaman Kami
            </a>
          </motion.div>
 
          {/* Quick Booking Bar Floating Over bottom */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            class="w-full max-w-4xl bg-[#0A0A0B]/90 backdrop-blur-xl border border-white/10 rounded-sm p-6 shadow-2xl"
          >
            <form onSubmit={handleBookingSubmit} class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Date selection */}
              <div class="text-left space-y-1.5">
                <label class="text-[10px] text-white/40 uppercase tracking-[0.25em] font-mono flex items-center gap-1.5">
                  <Calendar class="w-3 h-3 text-[#C5A059]" /> Tanggal
                </label>
                <input
                  type="date"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  class="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-[#E5E5E5] rounded-sm p-3 font-sans transition-all"
                />
              </div>
 
              {/* Guests Selector */}
              <div class="text-left space-y-1.5">
                <label class="text-[10px] text-white/40 uppercase tracking-[0.25em] font-mono flex items-center gap-1.5">
                  <Users class="w-3 h-3 text-[#C5A059]" /> Jumlah Tamu
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  class="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-[#E5E5E5] rounded-sm p-3 font-sans transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                    <option key={num} value={num} class="bg-[#0A0A0B]">
                      {num} Tamu
                    </option>
                  ))}
                </select>
              </div>
 
              {/* Preferred Hour */}
              <div class="text-left space-y-1.5">
                <label class="text-[10px] text-white/40 uppercase tracking-[0.25em] font-mono flex items-center gap-1.5">
                  <Clock class="w-3 h-3 text-[#C5A059]" /> Waktu Makan
                </label>
                <select
                  value={timeVal}
                  onChange={(e) => setTimeVal(e.target.value)}
                  class="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-[#E5E5E5] rounded-sm p-3 font-sans transition-all"
                >
                  {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((time) => (
                    <option key={time} value={time} class="bg-[#0A0A0B]">
                      {time}
                    </option>
                  ))}
                </select>
              </div>
 
              {/* Form Action */}
              <button
                type="submit"
                class="w-full bg-transparent hover:bg-white border border-[#C5A059] hover:border-white text-[#C5A059] hover:text-black font-display tracking-[0.25em] uppercase text-[10px] p-3.5 transition-all rounded-sm duration-300 cursor-pointer"
              >
                Reservasi Sekarang
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Culinary Pillars Section */}
      <div id="the-experience" class="py-24 max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium block mb-2">Koleksi Kuliner</span>
          <h2 class="font-display font-light text-3xl md:text-5xl text-white tracking-tight">Ikon Andalan Kami</h2>
          <div class="h-px w-10 bg-[#C5A059]/40 mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -8 }}
            class="bg-white/5 border border-white/5 rounded-sm overflow-hidden shadow-lg hover:border-[#C5A059]/20 transition-all group"
          >
            <div class="relative h-72 overflow-hidden bg-zinc-950">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrz70NMCRX0-oOIaxo0AI7-qsVIeBxKmmnxFQ87DeguXUiz7qKaokSPj_1QwQH3IV7Q9eMv8PwZVJ1hQe5gJCsFQSpZJFGxWAG-h3icCH4ew-GwhCfRAQoCHDmbMBn8QgOrsz9F_6bypPsdp9hBrUBUkVo5eKFgMglmcS4-GenBfu5doNLZOb-fyY627NGIfsAWii2B-S4Y2qgRn73D69IRR2su28WOpAyZ4zOvrhJ6WXqtoAJqPgtZUUQi1-nWd1qOevrvUMZAPhe"
                alt="Hokkaido Scallop Crudo"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/90 to-transparent"></div>
              <span class="absolute top-4 left-4 border border-[#C5A059]/30 text-[#C5A059] text-[9px] uppercase tracking-widest font-mono font-medium px-2.5 py-1 bg-zinc-950/80 backend-blur">
                Hidangan Pembuka
              </span>
            </div>
            <div class="p-6">
              <h3 class="font-display font-medium text-lg text-[#C5A059] mb-2">Hokkaido Scallop Crudo</h3>
              <p class="text-xs text-white/60 font-sans leading-relaxed">
                Kerang segar pilihan, kaviar jeruk nipis, emulsi kecap putih, dan kaldu dashi dingin. Ditaburi bubuk rumput laut premium.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -8 }}
            class="bg-white/5 border border-white/5 rounded-sm overflow-hidden shadow-lg hover:border-[#C5A059]/20 transition-all group"
          >
            <div class="relative h-72 overflow-hidden bg-zinc-950">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLrZsALN9dOJACYjx5QsSq9XYrIu84Fi4xOWcXcCJAQzwggkAEgZ902YCI4p4ISyes1ZL5t6ztxBpQEYi47OnS84eHFDuryrfIHhKQhwwRHEllXU0W3hy3EANnX5TzcVgW0jftQdY6UK6AM3wb64MW1GvufAYtA2xdNEKidDtcjrDCq2GDO8kypDY-q1PxY02DCr6vKvaONquvviclRsRu9TdxeTn5qTkQXRzaEvfk2c5L17KVC4bWs5Sm00p4SUkGHWQfX4Sq_RRH"
                alt="A5 Japanese Wagyu"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/90 to-transparent"></div>
              <span class="absolute top-4 left-4 border border-[#C5A059]/30 text-[#C5A059] text-[9px] uppercase tracking-widest font-mono font-medium px-2.5 py-1 bg-zinc-950/80 backend-blur">
                Hidangan Utama
              </span>
            </div>
            <div class="p-6">
              <h3 class="font-display font-medium text-lg text-[#C5A059] mb-2">A5 Wagyu &amp; Truffle</h3>
              <p class="text-xs text-white/60 font-sans leading-relaxed">
                Daging sapi Jepang kelas A5, puree bawang putih hitam, saus jamur liar, disempurnakan dengan serutan truffle hitam mewah.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -8 }}
            class="bg-white/5 border border-white/5 rounded-sm overflow-hidden shadow-lg hover:border-[#C5A059]/20 transition-all group"
          >
            <div class="relative h-72 overflow-hidden bg-zinc-950">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf9dNV8-N3Ykw5PdeQG7aN5aGNr6VhRFGGKYvrgM9nvOCO-exC6FYaVC8RxZK6GFTPsrGUDpMsE3Q0yruUmXhfmffNP83ZNgEIIvKuPBO9Krnk-o8CtYQI3H2kQ1oT3RaM2Xf17KkPVF6gB8pFpEJWQ7WA96NxaZ1x3tFQ10AZBeeOF9Dx_Jxv-O-3QziaXbOU10ECMMif5f7Ww0WJ1xPH_z5QG73pwpcPIqHcoue1FWp8DBaqXKR44d6LZxERgFS8tO7ucYG2ToS7"
                alt="Crimson Velvet"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/90 to-transparent"></div>
              <span class="absolute top-4 left-4 border border-[#C5A059]/30 text-[#C5A059] text-[9px] uppercase tracking-widest font-mono font-medium px-2.5 py-1 bg-zinc-950/80 backend-blur">
                Koktail Artisanal
              </span>
            </div>
            <div class="p-6">
              <h3 class="font-display font-medium text-lg text-[#C5A059] mb-2">Crimson Velvet</h3>
              <p class="text-xs text-white/60 font-sans leading-relaxed">
                Bourbon matang dipadukan dengan reduksi blackberry manis dan aroma rosemary asap untuk sentuhan klasik yang tak lekang waktu.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chef Philosophy */}
      <div class="bg-[#0A0A0B] py-24 border-t border-white/5">
        <div class="max-w-5xl mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Image with border */}
            <div class="relative bg-[#0A0A0B]">
              <div class="absolute -top-3 -left-3 w-12 h-12 border-t border-l border-[#C5A059]/40"></div>
              <div class="absolute -bottom-3 -right-3 w-12 h-12 border-b border-r border-[#C5A059]/40"></div>
              <div class="bg-white/5 p-2 rounded-sm border border-white/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbmS19Fpo9zeAoyLNWZgkkkoZixfhFMWPMbTeoGZErcQuM9JxGy1shTgvurZ-Np49_F-2WBBhTLYIp6e9iQ5yeJ9VVlJ9Y7_YhoslT3AkOrEhg0vOe_xcAOk7NbH2rMCr1zWd8Q1uESBHQ-i50As1WhgdGEZeJMczFogMF5fZuXoyEiVVgOMhKwVdID8xZDxR8nAwkie0QOPpoBDinlPpFrlJJe26HyHJayLg22t0ibDJR-g2MAibkcMPZxZbHyi3NFja4yG34gyvL"
                  alt="Kepala Chef Eleanor Vance"
                  class="rounded-sm w-full h-96 object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div class="space-y-6">
              <span class="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium">Kepala Chef &bull; Filosofi</span>
              <h3 class="font-display font-light text-3xl md:text-5xl text-white italic leading-tight">"Gourmet lebih dari sekadar rasa; ia adalah koreografi kenangan."</h3>
              <p class="text-xs text-white/60 font-sans leading-relaxed tracking-wider font-light">
                Chef Eleanor Vance memadukan pelatihan klasik Prancis yang ketat dengan kecintaan mendalam pada minimalisme Jepang. Dengan memanfaatkan bahan lokal musiman, setiap piring menjadi cerita puisi musim—dirancang untuk menarik tidak hanya selera, tetapi juga menciptakan momen gastronomi yang mengubah hidup.
              </p>
              <div class="h-px w-24 bg-white/10"></div>
              <div>
                <p class="font-display text-base font-normal text-white">Eleanor Vance</p>
                <p class="text-[10px] text-white/40 font-mono tracking-widest mt-1">DIREKTUR KULINER EKSEKUTIF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
