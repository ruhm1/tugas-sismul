import React from 'react';
import { motion } from 'motion/react';
import { Award, Eye, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="font-sans text-[#E5E5E5] pb-24 pt-8">
      {/* Hero Banner */}
      <div className="relative h-80 flex items-center justify-center overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjP-RHsBe75Y_K_Duh5yeOla5OrcAwPfbomxrJJpibOx8AS7UH31WD4RcdfwemXRvT9jWG8pCGn_e1uzHboYMIUXL13r_3sOztuDqGw556W4EdHr3hekIXsjNuAkeAXdaGi09IL74Jn0XXXmOYqrKqKEhSg5COcKNfgGrl00LafxLDF5gyWZsn5BGYTDmtjAhWXpwPOcq-sgam8GaBjLi765uQi9-lcI96FtprTIRsCoQBKo7AO4EkaeJFMhaOMquE7Gg1ZfxmNq1P"
          alt="Interior Restoran"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
        <div className="relative z-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium block mb-2">Kisah Kami</span>
          <h1 className="font-display font-light text-4xl md:text-6xl text-white tracking-tight">Tentang GOURMET</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-20">
        {/* History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium">Sejak 1998</span>
            <h2 className="font-display font-light text-3xl text-white">Sejarah Kami</h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Didirikan di jantung kota Paris, GOURMET bermula sebagai bistro kecil dengan impian yang berani. Selama lebih dari dua dekade, Kepala Chef Eleanor Vance mengubahnya menjadi destinasi tiga bintang Michelin, memadukan teknik klasik Prancis dengan minimalisme Jepang.
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              Setiap bab perjalanan kami didefinisikan oleh komitmen tak tergoyahkan terhadap keunggulan, bahan musiman, dan keyakinan bahwa bersantap adalah seni yang melibatkan semua indera.
            </p>
          </div>
          <div className="bg-white/5 p-2 rounded-sm border border-white/5">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbmS19Fpo9zeAoyLNWZgkkkoZixfhFMWPMbTeoGZErcQuM9JxGy1shTgvurZ-Np49_F-2WBBhTLYIp6e9iQ5yeJ9VVlJ9Y7_YhoslT3AkOrEhg0vOe_xcAOk7NbH2rMCr1zWd8Q1uESBHQ-i50As1WhgdGEZeJMczFogMF5fZuXoyEiVVgOMhKwVdID8xZDxR8nAwkie0QOPpoBDinlPpFrlJJe26HyHJayLg22t0ibDJR-g2MAibkcMPZxZbHyi3NFja4yG34gyvL"
              alt="Chef Eleanor Vance"
              className="rounded-sm w-full h-80 object-cover grayscale brightness-90"
            />
          </div>
        </motion.div>

        {/* Vision, Mission, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Eye className="w-6 h-6" />, title: 'Visi Kami', text: 'Menjadi destinasi paling terkenal di dunia untuk seni kuliner transformatif, di mana setiap piring menceritakan kisah dan setiap kunjungan menciptakan kenangan abadi.' },
            { icon: <Target className="w-6 h-6" />, title: 'Misi Kami', text: 'Kami menciptakan pengalaman bersantap tak terlupakan melalui bahan musiman, presisi artisanal, dan kemewahan atmosferik. Setiap tamu menerima layanan personal yang melampaui ekspektasi.' },
            { icon: <Heart className="w-6 h-6" />, title: 'Nilai Kami', text: 'Hasrat untuk kesempurnaan, penghormatan terhadap bahan baku, komitmen terhadap keberlanjutan, dan keyakinan bahwa gastronomi adalah bahasa universal yang menghubungkan orang lintas budaya.' },
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -5 }}
              className="bg-white/[0.03] border border-white/5 rounded-sm p-8 text-center space-y-4 hover:border-[#C5A059]/20 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center mx-auto text-[#C5A059]">
                {item.icon}
              </div>
              <h3 className="font-display text-lg text-white font-medium">{item.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Awards */}
        <div className="text-center space-y-8 border-t border-white/5 pt-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium">Pengakuan</span>
          <h2 className="font-display font-light text-3xl text-white">Penghargaan & Prestasi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['3 Bintang Michelin', '50 Terbaik Dunia', 'Relais & Châteaux', 'James Beard Award'].map((award) => (
              <div key={award} className="bg-white/[0.02] border border-white/5 rounded-sm p-6 flex flex-col items-center gap-2">
                <Award className="w-8 h-8 text-[#C5A059]" />
                <span className="font-display text-sm text-white font-medium">{award}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
