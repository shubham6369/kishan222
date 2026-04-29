'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Phone as PhoneIcon, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Copy, 
  Sprout, 
  CheckCircle2,
  Landmark,
  CreditCard,
  AlertCircle,
  Camera,
  Tractor,
  Printer
} from 'lucide-react';
import { load } from '@cashfreepayments/cashfree-js';
import MembershipCard from './MembershipCard';
import { auth, db, storage } from '@/lib/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

import Image from 'next/image';


type Step = 1 | 2 | 3 | 4 | 'success';

const steps = [
  { id: 1, title: "Identity", icon: User },
  { id: 2, title: "Farming", icon: Sprout },
  { id: 3, title: "Security", icon: Landmark },
  { id: 4, title: "Payment", icon: CreditCard },
  { id: 'success', title: "Card", icon: CheckCircle2 },
];

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dict } = useLanguage();
  const referrerId = searchParams.get('ref');
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    village: "",
    district: "",
    state: "Uttar Pradesh",
    crops: "",
    landSize: "",
    password: "",
    photoBase64: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [memberId, setMemberId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = useCallback(async (paymentId: string, orderId: string, recoveredData?: typeof formData) => {
    const currentData = recoveredData || formData;
    setIsSubmitting(true);
    setError('');
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error(dict.register.errors.session_lost);

      // Link the password to their phone account using EmailAuthProvider proxy
      const emailProxy = `${currentData.phone.replace(/\D/g, '')}@kishanseva.in`;
      
      try {
        const credential = EmailAuthProvider.credential(emailProxy, currentData.password);
        await linkWithCredential(user, credential);
      } catch (err: unknown) {
        console.warn('Linking credential warning:', err);
      }

      await updateProfile(user, { displayName: currentData.fullName });

      // Generate Membership ID
      const newMemberId = 'KSS-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      setMemberId(newMemberId);
      setReferralLink(`${window.location.origin}/register?ref=${newMemberId}`);

      // Upload Photo
      let finalPhotoUrl = currentData.photoBase64;
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop() || 'jpg';
        const storageRef = ref(storage, `farmers/${user.uid}/profile_${Date.now()}.${fileExt}`);
        await uploadBytes(storageRef, photoFile);
        finalPhotoUrl = await getDownloadURL(storageRef);
      }

      const normalizedPhone = currentData.phone.replace(/\D/g, '');

      // Store Farmer Data — only after payment is confirmed
      const userData = {
        uid: user.uid,
        fullName: currentData.fullName,
        phone: normalizedPhone,
        email: emailProxy,
        village: currentData.village,
        district: currentData.district,
        state: currentData.state,
        crops: currentData.crops,
        landSize: currentData.landSize,
        photoUrl: finalPhotoUrl,
        photoBase64: finalPhotoUrl,
        membershipId: newMemberId,
        referralCode: newMemberId,
        referredBy: referrerId || null,
        registrationDate: new Date().toISOString(),
        // Payment confirmation — card is unlocked only because payment succeeded
        membershipFeePaid: 50,
        membershipCardUnlocked: true,
        paymentId: paymentId,
        paymentOrderId: orderId,
        walletBalance: 0,
        stats: { totalReferrals: 0, earnings: 0, activeListings: 0 }
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // Credit ₹7 referral reward ONLY if:
      // 1. There is a referrer code
      // 2. Payment is confirmed (we're inside the payment handler)
      // 3. Referrer is a real, different user (fraud check)
      if (referrerId) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('membershipId', '==', referrerId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            const referrerData = referrerDoc.data();

            // Fraud guard: referrer's phone must differ from new user's phone
            const referrerPhone = (referrerData.phone || '').replace(/\D/g, '');
            if (referrerPhone === normalizedPhone) {
              console.warn('Self-referral attempt blocked:', referrerId);
            } else {
              // Credit ₹7 to referrer
              await updateDoc(doc(db, 'users', referrerDoc.id), {
                'stats.totalReferrals': increment(1),
                'stats.earnings': increment(7),
                'walletBalance': increment(7)
              });

              // Record referral details under referrer's subcollection
              const referralsRef = collection(db, 'users', referrerDoc.id, 'referrals');
              await setDoc(doc(referralsRef, user.uid), {
                referredUserId: user.uid,
                referredUserName: currentData.fullName,
                referredUserPhone: normalizedPhone,
                joinedAt: new Date().toISOString(),
                reward: 7,
                paymentConfirmed: true,
                paymentId: paymentId,
              });
            }
          }
        } catch (refErr: unknown) {
          // Non-fatal: referral credit failure should not block the user's card
          console.error('Error rewarding referrer:', refErr);
        }
      }

      setStep('success');
    } catch (err: unknown) {
      console.error(err);
      const error = err as Error;
      setError(error.message || 'Registration failed. Please try again.');
      setStep(3);
    } finally {
      setIsSubmitting(false);
      setPaymentProcessing(false);
    }
  }, [formData, dict.register.errors.session_lost, photoFile, referrerId, setMemberId, setReferralLink, setStep, setIsSubmitting, setError, setPaymentProcessing]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle return from Cashfree payment
  useEffect(() => {
    const order_id = searchParams.get('order_id');
    const cf_payment_id = searchParams.get('payment_id');
    
    if (order_id && step !== 'success') {
      const finalizeAfterPayment = async () => {
        setPaymentProcessing(true);
        try {
          // Verify payment status
          const res = await fetch(`/api/cashfree/verify-payment?order_id=${order_id}`);
          const data = await res.json();
          
          if (data.status === 'SUCCESS') {
            // Retrieve saved form data
            const savedData = localStorage.getItem('pending_registration');
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              // Update local state so handleSubmit has access to it
              setFormData(parsedData);
              await handleSubmit(cf_payment_id || data.paymentId, order_id, parsedData);
            } else {
              // Fallback: if localStorage is cleared, try to recover from current state
              // but current state might be lost on redirect
              await handleSubmit(cf_payment_id || data.paymentId, order_id);
            }
          } else {
            setError(dict.register.errors.payment_failed);
            setStep(4);
          }
        } catch (err: unknown) {
          console.error("Payment verification error:", err);
          setError("Payment verification failed. Please contact support.");
        } finally {
          setPaymentProcessing(false);
          // Clear saved data
          localStorage.removeItem('pending_registration');
        }
      };
      finalizeAfterPayment();
    }
  }, [searchParams, step, handleSubmit, dict.register.errors.payment_failed]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(dict.register.errors.photo_size);
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoBase64: reader.result as string });
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyOTP = async () => {
    if (otpValue.length === 6 && confirmationResult) {
      try {
        setIsSubmitting(true);
        await confirmationResult.confirm(otpValue);
        setError('');
        // Successfully verified OTP, move to next step
        setStep(2);
      } catch (err: unknown) {
        console.error("OTP Error:", err);
        setError(dict?.register?.errors?.invalid_otp || "Invalid OTP. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError(dict.register.errors.valid_otp_6);
    }
  };

  const processPayment = async () => {
    setPaymentProcessing(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error(dict.register.errors.session_lost);

      // Save form data to localStorage before redirecting
      localStorage.setItem('pending_registration', JSON.stringify(formData));

      // Step 1: Create Cashfree order on server
      const orderRes = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: 50, // ₹50 membership fee
          customerId: user.uid,
          customerPhone: formData.phone.replace(/\D/g, ''),
          customerName: formData.fullName,
          customerEmail: `${formData.phone.replace(/\D/g, '')}@kishanseva.in`,
          lang: 'en',
          returnUrl: `${window.location.origin}/register?order_id={order_id}&payment_id={payment_id}`
        }),
      });
      
      const orderData = await orderRes.json();
      if (!orderData.paymentSessionId) throw new Error(orderData.error || dict.register.errors.payment_failed);

      // Step 2: Open Cashfree Checkout
      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? 'production' : 'sandbox'
      });

      await cashfree.checkout({
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: "_self", // Redirect to returnUrl after payment
      });

    } catch (err: unknown) {
      console.error('Payment error:', err);
      const error = err as Error;
      setError(error.message || dict.register.errors.payment_init_failed);
      setPaymentProcessing(false);
    }
  };

  const handleSendOTP = async () => {
    if (isSubmitting || paymentProcessing) return;
    setError('');
    setIsSubmitting(true);
    
    try {
      // Check for duplicate phone number
      const usersRef = collection(db, 'users');
      const normalizedPhone = formData.phone.replace(/\D/g, '');
      const q = query(usersRef, where('phone', '==', normalizedPhone));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError(dict.register.errors.phone_registered);
        setIsSubmitting(false);
        return;
      }

      // Setup Recaptcha
      if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) throw new Error("Recaptcha initialization failed");

      const phoneWithCode = `+91${normalizedPhone}`;
      
      // Check if using dummy keys
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes('dummy')) {
        throw new Error("DUMMY_KEYS_DETECTED: Please configure real Firebase keys in .env.local");
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneWithCode, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setCountdown(60); // Start 60s countdown
      setError('');
    } catch (err: unknown) {
      console.error("OTP Send Error Details:", err);
      
      const authError = err as AuthError;
      let userMessage = dict.register.errors.otp_send_failed;
      
      if (authError.message?.includes('DUMMY_KEYS_DETECTED')) {
        userMessage = "Development Mode: Firebase dummy keys detected. Please add real credentials to .env.local to test SMS.";
      } else if (authError.code === 'auth/invalid-phone-number') {
        userMessage = "Invalid phone number format. Please check and try again.";
      } else if (authError.code === 'auth/quota-exceeded') {
        userMessage = "SMS quota exceeded for today. Please try again later.";
      } else if (authError.code === 'auth/too-many-requests') {
        userMessage = "Too many attempts. Please wait a few minutes before trying again.";
      } else if (authError.message) {
        userMessage = `Error: ${authError.message}`;
      }

      setError(userMessage);
      
      // Reset recaptcha on error so they can try again
      if (typeof window !== 'undefined' && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
        window.recaptchaVerifier = undefined;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (isSubmitting || paymentProcessing) return;
    setError('');
    if (step === 1) {
      if (!formData.fullName || !formData.phone || formData.phone.length < 10) {
        setError(dict.register.errors.valid_name_phone);
        return;
      }
      if (!otpSent) {
        await handleSendOTP();
      } else {
        await verifyOTP();
      }
    } else if (step === 2) {
      if (!formData.village || !formData.district || !formData.crops || !formData.landSize) {
        setError(dict.register.errors.farming_details);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.password || formData.password.length < 6) {
        setError(dict.register.errors.passcode_min);
        return;
      }
      setStep(4);
    }
  };

  const prevStep = () => {
    if (typeof step === 'number' && step > 1) {
      setStep((step - 1) as Step);
    }
  };


  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .membership-card, .membership-card * {
            visibility: visible;
          }
          .membership-card {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 500px;
          }
        }
      `}} />
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5 print:shadow-none print:border-transparent">
        {/* Premium Progress Header */}
        <div className="bg-[#122c1f]/5 p-6 md:p-8 flex justify-between items-center relative border-b border-[#122c1f]/10 print:hidden">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#122c1f]/10 -translate-y-1/2 shrink-0 z-0"></div>
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = step === 'success' || (typeof step === 'number' && typeof s.id === 'number' && s.id <= step);
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-1 md:gap-2 relative z-10">
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                    isActive 
                      ? "bg-[#122c1f] text-white border-[#122c1f] scale-110 shadow-lg" 
                      : "bg-white text-[#122c1f]/40 border-[#122c1f]/10"
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:block ${isActive ? "text-[#122c1f]" : "text-[#122c1f]/30"}`}>
                  {s.id === 1 ? dict.register.steps.identity :
                   s.id === 2 ? dict.register.steps.farming :
                   s.id === 3 ? dict.register.steps.security :
                   s.id === 4 ? dict.register.steps.payment :
                   dict.register.steps.card}
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-6 md:p-12 print:p-0">
          <AnimatePresence mode="wait">
            {step === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-8 print:space-y-0 print:block"
              >
                <div className="text-center space-y-2 print:hidden">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-[#122c1f]">{dict.register.success_title}</h2>
                  <p className="text-[#77574d] text-sm">{dict.register.success_desc}</p>
                </div>
                
                <div className="w-full flex justify-center py-4 print:py-0">
                  <MembershipCard 
                    memberData={{
                      fullName: formData.fullName,
                      membershipId: memberId,
                      location: `${formData.village}, ${formData.state}`,
                      phone: formData.phone,
                      crops: formData.crops,
                      landSize: formData.landSize,
                      photoBase64: formData.photoBase64,
                      registrationDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                      memberType: dict.register.member_type_farmer
                    }}
                  />
                </div>

                <div className="w-full max-w-md bg-[#fbf9f5] p-6 rounded-2xl border border-[#77574d]/10 space-y-4 print:hidden">
                  <button 
                    onClick={handlePrint}
                    className="w-full py-4 bg-white border-2 border-[#122c1f] text-[#122c1f] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#122c1f]/5 transition-all"
                  >
                    <Printer className="w-5 h-5" />
                    {dict.register.print_card}
                  </button>

                  <div className="pt-4 border-t border-black/5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#122c1f] mb-3">{dict.register.referral_link_label}</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white px-4 py-3 rounded-xl border border-[#77574d]/20 text-xs font-mono truncate flex items-center">
                        {referralLink}
                      </div>
                      <button 
                        onClick={() => {
                            navigator.clipboard.writeText(referralLink);
                            alert(dict.register.errors.link_copied);
                        }}
                        className="p-3 bg-[#122c1f] text-white rounded-xl hover:bg-[#122c1f]/90 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full py-4 bg-[#122c1f] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#122c1f]/90 transition-all shadow-md mt-4"
                  >
                    {dict.register.go_dashboard}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.register.mobile_verification}</h2>
                        <p className="text-sm text-[#77574d]">{dict.register.mobile_desc}</p>
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

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.register.full_name}</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder={dict.register.full_name_placeholder}
                              disabled={otpSent}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.register.phone_number}</label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder={dict.register.phone_placeholder}
                              disabled={otpSent}
                            />
                          </div>
                        </div>

                        <AnimatePresence>
                          {otpSent && (
                            <motion.div 
                              key="otp-field"
                              initial={{ opacity: 0, height: 0, scale: 0.95 }}
                              animate={{ opacity: 1, height: 'auto', scale: 1 }}
                              exit={{ opacity: 0, height: 0, scale: 0.95 }}
                              className="space-y-4 pt-2 overflow-hidden"
                            >
                              <div className="flex justify-between items-end">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-green-700">{dict.register.enter_otp}</label>
                                <button 
                                  onClick={() => {
                                    setOtpSent(false);
                                    setOtpValue('');
                                    setConfirmationResult(null);
                                    setCountdown(0);
                                  }}
                                  className="text-[10px] font-bold uppercase tracking-widest text-[#122c1f] hover:underline"
                                >
                                  {dict.auth.change_number}
                                </button>
                              </div>
                              <div className="relative">
                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600/50" />
                                <input
                                  type="text"
                                  maxLength={6}
                                  value={otpValue}
                                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                                  className="w-full pl-12 pr-4 py-4 bg-green-50 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-[#122c1f] font-mono tracking-[0.5em] text-lg"
                                  placeholder={dict.register.otp_placeholder}
                                />
                              </div>
                              
                              <div className="flex justify-center">
                                {countdown > 0 ? (
                                  <span className="text-xs text-[#77574d]">
                                    {dict?.auth?.wait_resend?.replace('{seconds}', countdown.toString()) || `${countdown}s`}
                                  </span>
                                ) : (
                                  <button
                                    onClick={handleSendOTP}
                                    className="text-xs font-bold text-[#122c1f] hover:underline"
                                  >
                                    {dict?.auth?.resend_otp || "Resend OTP"}
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Recaptcha container removed from here and moved to persistent location */}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.register.farming_profile}</h2>
                        <p className="text-sm text-[#77574d]">{dict.register.farming_desc}</p>
                      </div>
                      
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <div className="w-24 h-24 bg-[#fbf9f5] rounded-full border-2 border-dashed border-[#122c1f]/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#122c1f]/50 relative">
                            {formData.photoBase64 ? (
                              <Image 
                                src={formData.photoBase64} 
                                alt="Preview" 
                                width={96}
                                height={96}
                                className="w-full h-full object-cover" 
                                unoptimized={formData.photoBase64.startsWith('data:')}
                              />
                            ) : (
                              <Camera className="w-8 h-8 text-[#122c1f]/30 group-hover:text-[#122c1f]/60" />
                            )}
                          </div>
                          <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full text-[10px] shadow-sm font-bold border border-[#122c1f]/10 whitespace-nowrap left-1/2 -translate-x-1/2">
                            {dict.register.upload_photo}
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handlePhotoUpload}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.register.village}</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.village}
                              onChange={(e) => setFormData({...formData, village: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder={dict.register.village_placeholder}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.register.district}</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.district}
                              onChange={(e) => setFormData({...formData, district: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder={dict.register.district_placeholder}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.register.crops}</label>
                          <div className="relative">
                            <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.crops}
                              onChange={(e) => setFormData({...formData, crops: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder={dict.register.crops_placeholder}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.register.land_size}</label>
                          <div className="relative">
                            <Tractor className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="number"
                              value={formData.landSize}
                              onChange={(e) => setFormData({...formData, landSize: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder={dict.register.land_size_placeholder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.register.set_passcode}</h2>
                        <p className="text-sm text-[#77574d]">{dict.register.passcode_desc}</p>
                      </div>
                      
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.register.secret_passcode}</label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-[#77574d]/50"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full px-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder={dict.register.passcode_placeholder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-2 text-center">
                        <div className="w-16 h-16 bg-[#122c1f]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="w-8 h-8 text-[#122c1f]" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-[#122c1f]">{dict.register.membership_fee}</h2>
                        <p className="text-sm text-[#77574d]">{dict.register.fee_desc}</p>
                      </div>
                      
                      <div className="p-6 bg-[#fbf9f5] rounded-2xl border border-black/5">
                        <div className="flex justify-between items-center pb-4 border-b border-black/5">
                          <span className="text-[#77574d]">{dict.register.lifelong_card}</span>
                          <span className="font-bold text-[#122c1f]">₹50.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <span className="font-bold text-lg text-[#122c1f]">{dict.register.total_amount}</span>
                          <span className="font-bold text-2xl text-green-700">₹50</span>
                        </div>
                      </div>

                      {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                          {error}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    {step > 1 && (
                      <button
                        onClick={prevStep}
                        disabled={isSubmitting || paymentProcessing}
                        className="flex-1 py-4 px-6 border border-[#122c1f]/10 rounded-xl font-bold text-[#122c1f] flex items-center justify-center gap-2 hover:bg-[#122c1f]/5 transition-all disabled:opacity-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        {dict?.register?.back || "Back"}
                      </button>
                    )}
                    <button
                      onClick={step === 4 ? processPayment : nextStep}
                      disabled={isSubmitting || paymentProcessing}
                      className="flex-2 py-4 px-6 bg-[#122c1f] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isSubmitting || paymentProcessing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          {step === 1 && !otpSent ? (dict?.register?.send_otp || "Send OTP") : 
                           step === 1 && otpSent ? (dict?.register?.verify_otp || "Verify OTP") : 
                           step === 4 ? (dict?.register?.pay_securely || "Pay Securely") : (dict?.register?.continue || "Continue")}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Persistent Recaptcha container to prevent DOM errors during step transitions */}
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </>
  );
}
