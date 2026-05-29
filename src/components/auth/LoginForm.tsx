'use client';

import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  AlertCircle, 
  Phone as PhoneIcon, 
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Dictionary } from '@/context/LanguageContext';

interface LoginFormProps {
  lang: string;
  dict: Dictionary;
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function LoginForm({ lang, dict }: LoginFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
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

  const [formData, setFormData] = useState({
    phone: '',
  });

  // Cleanup recaptcha on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
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
      setError(dict.login.error_phone);
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
      setCountdown(60);
    } catch (err: unknown) {
      console.error("OTP Send Error:", err);
      const authError = err as AuthError;
      let userMessage = 'Failed to send OTP. Please try again.';
      if (authError.code === 'auth/invalid-phone-number') userMessage = "Invalid phone number.";
      if (authError.code === 'auth/quota-exceeded') userMessage = "SMS quota exceeded. Try later.";
      if (authError.code === 'auth/too-many-requests') userMessage = "Too many attempts. Wait a bit.";
      setError(userMessage);
      
      if (typeof window !== 'undefined' && window.recaptchaVerifier) {
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
      setError(dict.login.error_otp);
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await confirmationResult.confirm(otpValue);
      router.push(`/${lang}/dashboard`);
    } catch (err: unknown) {
      console.error("OTP Verify Error:", err);
      const authError = err as AuthError;
      let msg = 'Invalid OTP code. Please check and try again.';
      if (authError.code === 'auth/code-expired') {
        msg = "OTP code has expired. Please request a new one.";
      } else if (authError.code === 'auth/session-expired') {
        msg = "Session has expired. Please request a new OTP.";
      } else if (authError.code) {
        msg = `${msg} (${authError.code.replace('auth/', '')})`;
      } else if (authError.message) {
        msg = `${msg} (${authError.message})`;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="max-w-md mx-auto">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-black/5"
      >
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-primary font-bold text-[10px] uppercase tracking-widest">
            <Star className="w-3 h-3 fill-primary" />
            {dict.login.badge}
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#122c1f]">{dict.login.title}</h1>
          <p className="text-sm text-[#77574d]">{dict.login.subtitle}</p>
        </div>

        <m.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} 
          className="space-y-6"
        >
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {!otpSent ? (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.login.phone_label}</label>
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
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-xs">
                <ShieldCheck className="w-4 h-4" />
                {dict.login.otp_sent_to} {formData.phone}
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)} 
                  className="ml-auto font-bold underline"
                >
                  {dict.login.change}
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.login.otp_label}</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-[#77574d]/10 rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f] font-mono tracking-[0.5em] text-lg"
                    placeholder="------"
                  />
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
              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                {otpSent ? dict.login.verify_otp : dict.login.send_otp}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </m.form>

        <div className="mt-10 text-center">
          <p className="text-sm text-[#77574d]">
            {dict.login.no_account}{' '}
            <Link href={`/${lang}/register`} className="text-secondary font-bold hover:underline">
              {dict.login.register}
            </Link>
          </p>
        </div>
      </m.div>
    </div>
  );
}
