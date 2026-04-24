'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Star, 
  AlertCircle, 
  Phone as PhoneIcon, 
  ShieldCheck,
  Smartphone,
  Key
} from 'lucide-react';
import Link from 'next/link';
import { 
  signInWithEmailAndPassword, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login Method State
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('otp');
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [formData, setFormData] = useState({
    email: '', // Also used for phone in password mode
    phone: '',
    password: '',
  });

  // Cleanup recaptcha on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('Recaptcha resolved');
        }
      });
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const phone = formData.phone.replace(/\D/g, '');
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const phoneWithCode = `+91${phone}`;
      
      const confirmation = await signInWithPhoneNumber(auth, phoneWithCode, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err: any) {
      console.error("OTP Send Error:", err);
      let userMessage = 'Failed to send OTP. Please try again.';
      if (err.code === 'auth/invalid-phone-number') userMessage = "Invalid phone number.";
      if (err.code === 'auth/quota-exceeded') userMessage = "SMS quota exceeded. Try later.";
      if (err.code === 'auth/too-many-requests') userMessage = "Too many attempts. Wait a bit.";
      setError(userMessage);
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6 || !confirmationResult) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await confirmationResult.confirm(otpValue);
      router.push('/dashboard');
    } catch (err: any) {
      console.error("OTP Verify Error:", err);
      setError('Invalid OTP code. Please check and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let loginEmail = formData.email;
      if (!loginEmail.includes('@')) {
        loginEmail = `${loginEmail.replace(/\D/g, '')}@kishanseva.in`;
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
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
                <Star className="w-3 h-3 fill-primary" />
                Member Access
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#122c1f]">Welcome Back</h1>
              <p className="text-sm text-[#77574d]">Sign in to your farmer dashboard</p>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-[#fbf9f5] p-1 rounded-xl mb-8">
              <button
                onClick={() => {
                  setLoginMethod('otp');
                  setError('');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
                  loginMethod === 'otp' ? 'bg-white shadow-sm text-[#122c1f]' : 'text-[#77574d]/60 hover:text-[#77574d]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                SMS OTP
              </button>
              <button
                onClick={() => {
                  setLoginMethod('password');
                  setError('');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
                  loginMethod === 'password' ? 'bg-white shadow-sm text-[#122c1f]' : 'text-[#77574d]/60 hover:text-[#77574d]'
                }`}
              >
                <Key className="w-4 h-4" />
                Passcode
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {loginMethod === 'otp' ? (
                <motion.form 
                  key="otp-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} 
                  className="space-y-6"
                >
                  {!otpSent ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Mobile Number</label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        OTP sent to +91 {formData.phone}
                        <button 
                          type="button" 
                          onClick={() => setOtpSent(false)} 
                          className="ml-auto font-bold underline"
                        >
                          Change
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">6-Digit OTP</label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                            className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f] font-mono tracking-[0.5em] text-lg"
                            placeholder="------"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div id="recaptcha-container"></div>

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
                        {otpSent ? 'Verify & Sign In' : 'Send OTP Code'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="password-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handlePasswordSubmit} 
                  className="space-y-6"
                >
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Passcode</label>
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
                </motion.form>
              )}
            </AnimatePresence>

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
