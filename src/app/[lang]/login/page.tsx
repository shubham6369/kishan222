'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Star, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // If user enters a phone number instead of email, we handle that
      let loginEmail = formData.email;
      if (!loginEmail.includes('@')) {
        loginEmail = `${loginEmail}@kishanseva.in`;
      }

      await signInWithEmailAndPassword(auth, loginEmail, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Invalid credentials. Please check your phone/email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f5]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5 p-8 md:p-12"
          >
            <div className="text-center space-y-4 mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
                <Star className="w-3 h-3 fill-primary" />
                Member Access
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#122c1f]">Welcome Back</h1>
              <p className="text-sm text-[#77574d]">Sign in to your farmer dashboard</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Phone or Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                  <input
                    type="text"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Password</label>
                  <Link href="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-[#77574d]/50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#122c1f] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-[#77574d]">
                Not a member yet?{' '}
                <Link href="/register" className="text-secondary font-bold hover:underline">
                  Join the Samiti
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
