'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone as PhoneIcon, 
  ShieldCheck,
  AlertCircle,
  Key,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  updatePassword,
  getAuth,
  signOut
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { dict, lang } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Phone, 2: OTP, 3: New Passcode
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    newPasscode: ''
  });
  
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

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
        size: 'invisible'
      });
    }
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    
    const phone = formData.phone.replace(/\D/g, '');
    if (phone.length < 10) {
      setError(dict.auth.error_phone);
      return;
    }

    setIsSubmitting(true);
    try {
      // First verify user exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phone', '==', phone));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError("This mobile number is not registered. Please register first.");
        setIsSubmitting(false);
        return;
      }

      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const phoneWithCode = `+91${phone}`;
      
      const confirmation = await signInWithPhoneNumber(auth, phoneWithCode, appVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
      setCountdown(60);
    } catch (err: any) {
      console.error("OTP Send Error:", err);
      setError(dict.register.errors.otp_send_failed);
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
    if (formData.otp.length !== 6 || !confirmationResult) {
      setError(dict.auth.error_otp);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await confirmationResult.confirm(formData.otp);
      setStep(3);
    } catch (err: any) {
      console.error("OTP Verify Error:", err);
      setError('Invalid code. Please check and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPasscode.length < 6) {
      setError(dict.register.errors.passcode_min);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Verification session lost. Please try again.");
      
      await updatePassword(user, formData.newPasscode);
      setSuccess(true);
      // Log them out so they can log back in with new passcode properly
      await signOut(auth);
    } catch (err: any) {
      console.error("Reset Error:", err);
      setError('Failed to update passcode. ' + (err.message || ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f5]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Link 
            href={`/${lang}/login`}
            className="inline-flex items-center gap-2 text-[#77574d] hover:text-[#122c1f] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">{dict.forgot.back_login}</span>
          </Link>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-black/5">
            {!success ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-serif font-bold text-[#122c1f]">{dict.forgot.title}</h1>
                  <p className="text-sm text-[#77574d]">{dict.forgot.subtitle}</p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSendOTP}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.forgot.phone_label}</label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                            placeholder={dict.login.phone_placeholder}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#122c1f] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#122c1f]/90 transition-all shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? "..." : dict.forgot.send_otp}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleVerifyOTP}
                      className="space-y-6"
                    >
                      <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        Code sent to {formData.phone}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.login.otp_label}</label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={formData.otp}
                            onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                            className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f] font-mono tracking-[0.5em] text-lg"
                            placeholder="------"
                          />
                        </div>
                      </div>

                      <div className="flex justify-center">
                        {countdown > 0 ? (
                          <p className="text-xs text-[#77574d]">
                            {dict.auth.wait_resend.replace('{seconds}', countdown.toString())}
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            className="text-xs font-bold text-[#122c1f] hover:underline"
                          >
                            {dict.auth.resend_otp}
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#122c1f] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#122c1f]/90 transition-all shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? "..." : dict.forgot.verify_otp}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.form>
                  )}

                  {step === 3 && (
                    <motion.form
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleResetPasscode}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.forgot.new_passcode}</label>
                        <div className="relative">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                          <input
                            type="password"
                            required
                            value={formData.newPasscode}
                            onChange={(e) => setFormData({...formData, newPasscode: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                            placeholder={dict.forgot.new_passcode_placeholder}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#122c1f] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#122c1f]/90 transition-all shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? "..." : dict.forgot.reset_button}
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
                
                <div id="recaptcha-container"></div>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.forgot.success_title}</h2>
                  <p className="text-sm text-[#77574d]">{dict.forgot.success_desc}</p>
                </div>
                <button
                  onClick={() => router.push(`/${lang}/login`)}
                  className="w-full py-4 bg-[#122c1f] text-white rounded-xl font-bold hover:bg-[#122c1f]/90 transition-all shadow-lg"
                >
                  {dict.forgot.back_login}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
