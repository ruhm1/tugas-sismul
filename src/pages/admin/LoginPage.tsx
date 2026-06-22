import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../components/Toast';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      showToast('Login berhasil!', 'success');
      navigate('/admin');
    } catch {
      showToast('Email atau kata sandi tidak valid.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8E6E3A] flex items-center justify-center mx-auto border border-white/10">
            <Star className="w-7 h-7 text-black fill-current" />
          </div>
          <h1 className="font-display text-2xl text-white tracking-wide">Login Admin</h1>
          <p className="text-xs text-white/40 font-mono">PUSAT KONTROL GOURMET</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/[0.02] border border-white/5 rounded-lg p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-lg p-3.5 transition-all"
              placeholder="admin@gourmet.com"
            />
            {errors.email && <p className="text-rose-400 text-[10px]">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Kata Sandi</label>
            <input
              {...register('password')}
              type="password"
              className="w-full bg-[#0A0A0B] border border-white/10 focus:border-[#C5A059]/40 outline-none text-xs text-zinc-100 rounded-lg p-3.5 transition-all"
              placeholder="Masukkan kata sandi"
            />
            {errors.password && <p className="text-rose-400 text-[10px]">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C5A059] hover:bg-[#8E6E3A] disabled:opacity-50 text-black font-display font-medium tracking-[0.2em] uppercase text-[10px] py-4 rounded-lg transition-all cursor-pointer"
          >
            {isSubmitting ? 'Mengautentikasi...' : 'Masuk'}
          </button>

          <p className="text-[10px] text-white/30 font-mono text-center">
            Gunakan kredensial Firebase Auth Anda
          </p>
        </form>
      </div>
    </div>
  );
}
