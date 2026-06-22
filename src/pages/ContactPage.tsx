import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import api from '../services/api';
import { showToast } from '../components/Toast';

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Alamat email tidak valid'),
  subject: z.string().min(3, 'Subjek minimal 3 karakter'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/contacts', data);
      showToast('Pesan berhasil dikirim!', 'success');
      reset();
    } catch {
      showToast('Gagal mengirim pesan. Silakan coba lagi.', 'error');
    }
  };

  return (
    <div className="font-sans text-[#E5E5E5] pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#C5A059] font-medium block mb-2">Hubungi Kami</span>
          <h1 className="font-display font-light text-4xl md:text-5xl text-white tracking-tight">Kontak Kami</h1>
          <div className="h-px w-10 bg-[#C5A059]/40 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info + Map */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <MapPin className="w-5 h-5" />, label: 'Alamat', value: '12 Rue de la Gastronomie\nParis 75008, Prancis' },
                { icon: <Phone className="w-5 h-5" />, label: 'Telepon', value: '+33 1 42 68 53 00' },
                { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'reservations@gourmet.com' },
                { icon: <Clock className="w-5 h-5" />, label: 'Jam Buka', value: 'Rabu-Minggu: 17.00 - 23.30\nSenin-Selasa: Tutup' },
              ].map((item) => (
                <div key={item.label} className="bg-white/[0.03] border border-white/5 rounded-sm p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[#C5A059]">
                    {item.icon}
                    <span className="font-mono text-[9px] uppercase tracking-widest">{item.label}</span>
                  </div>
                  <p className="text-xs text-white/60 whitespace-pre-line leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className="bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9914406081493!2d2.292292615674388!3d48.87123947928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc4f8f3049b%3A0x2c7f44b1e0f1a8e0!2sParis%2C+France!5e0!3m2!1sen!2sfr!4v1620000000000"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi GOURMET"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/[0.02] border border-white/5 rounded-sm p-6 md:p-8">
            <h3 className="font-display text-xl text-white font-medium mb-6">Kirim pesan kepada kami</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Nama *</label>
                <input
                  {...register('name')}
                  className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-sm p-3.5 transition-all"
                  placeholder="Nama Anda"
                />
                {errors.name && <p className="text-rose-400 text-[10px]">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Email *</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-sm p-3.5 transition-all"
                  placeholder="email@anda.com"
                />
                {errors.email && <p className="text-rose-400 text-[10px]">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Subjek *</label>
                <input
                  {...register('subject')}
                  className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-sm p-3.5 transition-all"
                  placeholder="Subjek"
                />
                {errors.subject && <p className="text-rose-400 text-[10px]">{errors.subject.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Pesan *</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-sm p-3.5 transition-all resize-none"
                  placeholder="Pesan Anda..."
                />
                {errors.message && <p className="text-rose-400 text-[10px]">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C5A059] hover:bg-[#8E6E3A] disabled:opacity-50 text-black font-display font-medium tracking-[0.2em] uppercase text-[10px] py-4 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
