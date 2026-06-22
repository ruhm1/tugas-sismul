import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const schema = z.object({
  name: z.string().min(1, 'Wajib diisi'),
  description: z.string().min(10, 'Minimal 10 karakter'),
  vision: z.string().min(1, 'Wajib diisi'),
  mission: z.string().min(1, 'Wajib diisi'),
  address: z.string().min(1, 'Wajib diisi'),
  phone: z.string().min(1, 'Wajib diisi'),
  email: z.string().email('Email tidak valid'),
  operatingHours: z.string().min(1, 'Wajib diisi'),
});

type FormData = z.infer<typeof schema>;

export default function AdminProfilePage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    api.get('/restaurant').then(res => {
      const d = res.data;
      reset({
        name: d.name || '', description: d.description || '', vision: d.vision || '', mission: d.mission || '',
        address: d.address || '', phone: d.phone || '', email: d.email || '', operatingHours: d.operatingHours || '',
      });
    }).catch(() => {});
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.put('/restaurant', data);
      showToast('Profil diperbarui!', 'success');
    } catch {
      showToast('Gagal memperbarui profil', 'error');
    }
  };

  const inputClass = "w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-white rounded-lg p-3 transition-all";

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] block mb-1">Pengaturan</span>
        <h1 className="font-display font-light text-3xl text-white">Profil Restoran</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#111113] border border-white/5 rounded-xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1"><label className="text-[9px] font-mono text-white/40 uppercase">Nama</label><input {...register('name')} className={inputClass} />{errors.name && <p className="text-rose-400 text-[10px]">{errors.name.message}</p>}</div>
          <div className="space-y-1"><label className="text-[9px] font-mono text-white/40 uppercase">Email</label><input {...register('email')} type="email" className={inputClass} />{errors.email && <p className="text-rose-400 text-[10px]">{errors.email.message}</p>}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1"><label className="text-[9px] font-mono text-white/40 uppercase">Telepon</label><input {...register('phone')} className={inputClass} />{errors.phone && <p className="text-rose-400 text-[10px]">{errors.phone.message}</p>}</div>
          <div className="space-y-1"><label className="text-[9px] font-mono text-white/40 uppercase">Alamat</label><input {...register('address')} className={inputClass} />{errors.address && <p className="text-rose-400 text-[10px]">{errors.address.message}</p>}</div>
        </div>
        <div className="space-y-1"><label className="text-[9px] font-mono text-white/40 uppercase">Jam Operasional</label><input {...register('operatingHours')} className={inputClass} />{errors.operatingHours && <p className="text-rose-400 text-[10px]">{errors.operatingHours.message}</p>}</div>
        <div className="space-y-1"><label className="text-[9px] font-mono text-white/40 uppercase">Deskripsi</label><textarea {...register('description')} rows={3} className={`${inputClass} resize-none`} />{errors.description && <p className="text-rose-400 text-[10px]">{errors.description.message}</p>}</div>
        <div className="space-y-1"><label className="text-[9px] font-mono text-white/40 uppercase">Visi</label><textarea {...register('vision')} rows={2} className={`${inputClass} resize-none`} />{errors.vision && <p className="text-rose-400 text-[10px]">{errors.vision.message}</p>}</div>
        <div className="space-y-1"><label className="text-[9px] font-mono text-white/40 uppercase">Misi</label><textarea {...register('mission')} rows={2} className={`${inputClass} resize-none`} />{errors.mission && <p className="text-rose-400 text-[10px]">{errors.mission.message}</p>}</div>

        <button type="submit" disabled={isSubmitting} className="bg-[#C5A059] hover:bg-[#8E6E3A] disabled:opacity-50 text-black font-display text-xs tracking-wider py-3 px-8 rounded-lg cursor-pointer">
          {isSubmitting ? 'Menyimpan...' : 'Perbarui Profil'}
        </button>
      </form>
    </div>
  );
}
