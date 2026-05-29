'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Phone as PhoneIcon, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Copy, 
  Sprout, 
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Camera,
  Calendar,
  Printer,
  Download
} from 'lucide-react';
import { auth, db, storage } from '@/lib/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

import Image from 'next/image';
import FarmerCardVisual from './dashboard/FarmerCardVisual';


type Step = 1 | 2 | 3 | 'success';

const steps = [
  { id: 1, title: "Identity", icon: User },
  { id: 2, title: "Farming", icon: Sprout },
  { id: 3, title: "Payment", icon: CreditCard },
  { id: 'success', title: "Complete", icon: CheckCircle2 },
];

const get10DigitPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
};

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dict, lang } = useLanguage();
  const referrerId = searchParams.get('ref');
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    village: "",
    district: "",
    state: "Uttar Pradesh",
    crops: "",
    photoBase64: "",
    fatherName: "",
    dob: "",
    gender: "Male",
    postOffice: "",
    pincode: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [memberId, setMemberId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [countdown, setCountdown] = useState(0);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = async (side: 'front' | 'back') => {
    const element = document.getElementById(`farmer-card-${side}`);
    if (!element) {
      alert('Card element not found.');
      return;
    }
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Farmer_ID_${side === 'front' ? 'Front' : 'Back'}_${memberId || 'Card'}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating card image:', err);
      alert('Failed to download card. Please try using print to save as PDF.');
    }
  };

  const handleSubmit = useCallback(async (paymentId: string, orderId: string, recoveredData?: typeof formData) => {
    const currentData = recoveredData || formData;
    setIsSubmitting(true);
    setError('');
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error(dict.register.errors.session_lost);

      // Generate email proxy for user profile
      const emailProxy = `${get10DigitPhone(currentData.phone)}@kishanseva.in`;

      await updateProfile(user, { displayName: currentData.fullName });

      // Generate Membership ID
      const newMemberId = 'KSS-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      setMemberId(newMemberId);
      setReferralLink(`${window.location.origin}/register?ref=${newMemberId}`);

      // Upload Photo
      let finalPhotoUrl = currentData.photoBase64;
      if (photoFile) {
        try {
          const fileExt = photoFile.name.split('.').pop() || 'jpg';
          const storageRef = ref(storage, `farmers/${user.uid}/profile_${Date.now()}.${fileExt}`);
          await uploadBytes(storageRef, photoFile);
          finalPhotoUrl = await getDownloadURL(storageRef);
        } catch (storageErr) {
          console.warn('Firebase Storage upload failed, falling back to base64 data URI:', storageErr);
          finalPhotoUrl = currentData.photoBase64;
        }
      }

      const normalizedPhone = get10DigitPhone(currentData.phone);

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
        photoUrl: finalPhotoUrl,
        photoBase64: finalPhotoUrl,
        membershipId: newMemberId,
        referralCode: newMemberId,
        referredBy: referrerId || null,
        registrationDate: new Date().toISOString(),
        membershipFeePaid: 50,
        paymentId: paymentId,
        paymentOrderId: orderId,
        walletBalance: 0,
        stats: { totalReferrals: 0, earnings: 0, activeListings: 0 },
        fatherName: currentData.fatherName || "",
        dob: currentData.dob || "",
        gender: currentData.gender || "Male",
        postOffice: currentData.postOffice || "",
        pincode: currentData.pincode || ""
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

  // Dynamically load Razorpay Checkout script
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
        const result = await confirmationResult.confirm(otpValue);
        setError('');
        
        // Post-authentication check: if user already has an active registration/paid fee,
        // bypass registration steps and redirect straight to the dashboard.
        if (result.user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (userDoc.exists() && userDoc.data()?.membershipId) {
              router.push(`/${lang}/dashboard`);
              return;
            }
          } catch (dbErr) {
            console.warn("Firestore user check blocked or failed. Proceeding with registration:", dbErr);
          }
        }

        // Successfully verified OTP, move to next step
        setStep(2);
      } catch (err: unknown) {
        console.error("OTP Error:", err);
        const authError = err as AuthError;
        let msg = dict?.register?.errors?.invalid_otp || "Invalid OTP. Please try again.";
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

      // Step 1: Create Razorpay order on server
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: 50, // ₹50 smart ID card issuance fee
          customerId: user.uid,
          customerPhone: get10DigitPhone(formData.phone),
          customerName: formData.fullName,
          customerEmail: `${get10DigitPhone(formData.phone)}@kishanseva.in`
        }),
      });
      
      const orderData = await orderRes.json();
      if (orderData.error) throw new Error(orderData.error);
      if (!orderData.orderId) throw new Error(dict.register.errors.payment_failed || 'Failed to initialize payment order');

      // Step 2: Open Razorpay Checkout Modal
      const RazorpayConstructor = (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
      if (!RazorpayConstructor) {
        throw new Error('Payment gateway failed to load. Please refresh the page and try again.');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Kishan Seva Samiti',
        description: 'Lifelong Smart Card Issuance Fee',
        order_id: orderData.orderId,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            setPaymentProcessing(true);
            // Verify payment on backend
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.status === 'SUCCESS') {
              // Finalize registration
              await handleSubmit(response.razorpay_payment_id, response.razorpay_order_id);
            } else {
              setError(verifyData.error || dict.register.errors.payment_failed || 'Payment verification failed');
              setPaymentProcessing(false);
            }
          } catch (verifyErr: unknown) {
            console.error('Verification error:', verifyErr);
            setError('Payment verification failed. Please contact support.');
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: `${get10DigitPhone(formData.phone)}@kishanseva.in`,
          contact: get10DigitPhone(formData.phone),
        },
        theme: {
          color: '#122c1f',
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
          }
        }
      };

      const rzp = new RazorpayConstructor(options);
      rzp.open();

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
      const normalizedPhone = get10DigitPhone(formData.phone);
      
      // Check for duplicate phone number
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', normalizedPhone));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setError(dict.register.errors.phone_registered);
          setIsSubmitting(false);
          return;
        }
      } catch (dbErr: unknown) {
        // If Firestore rules restrict unauthenticated reads, log a warning and proceed.
        // The duplicate check is performed securely post-authentication in verifyOTP.
        console.warn("Firestore permissions blocked duplicate phone check. Proceeding to OTP verification:", dbErr);
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
      const localPhone = get10DigitPhone(formData.phone);
      if (!formData.fullName || !formData.phone || localPhone.length !== 10) {
        setError(dict.register.errors.valid_name_phone || "Please enter a valid 10-digit phone number");
        return;
      }
      if (!otpSent) {
        await handleSendOTP();
      } else {
        await verifyOTP();
      }
    } else if (step === 2) {
      if (
        !formData.village || 
        !formData.district || 
        !formData.crops || 
        !formData.fatherName ||
        !formData.dob ||
        !formData.gender ||
        !formData.postOffice ||
        !formData.pincode
      ) {
        setError("कृपया सभी व्यक्तिगत और कृषि विवरण भरें / Please fill all details");
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    if (typeof step === 'number' && step > 1) {
      setStep((step - 1) as Step);
    }
  };


  return (
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
                   s.id === 3 ? dict.register.steps.payment :
                   dict.register.steps.complete}
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-6 md:p-12 print:p-0">
          <AnimatePresence mode="wait">
            {step === 'success' ? (
              <m.div
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
                
                {(() => {
                  const tempUserData = {
                    uid: auth.currentUser?.uid || 'temp',
                    fullName: formData.fullName,
                    phone: formData.phone,
                    membershipId: memberId,
                    registrationDate: new Date().toISOString(),
                    photoUrl: formData.photoBase64,
                    photoBase64: formData.photoBase64,
                    village: formData.village,
                    district: formData.district,
                    state: formData.state,
                    crops: formData.crops,
                    fatherName: formData.fatherName,
                    dob: formData.dob,
                    gender: formData.gender,
                    postOffice: formData.postOffice,
                    pincode: formData.pincode,
                  };
                  return (
                    <div className="w-full flex flex-col items-center py-2">
                      <style>{`
                        @media print {
                          body * {
                            visibility: hidden !important;
                          }
                          #printable-card-area, #printable-card-area * {
                            visibility: visible !important;
                          }
                          #printable-card-area {
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            height: auto !important;
                            display: flex !important;
                            flex-direction: column !important;
                            align-items: center !important;
                            justify-content: center !important;
                            gap: 40px !important;
                            padding: 20px 0 !important;
                            margin: 0 !important;
                            background: white !important;
                            transform: none !important;
                          }
                          @page {
                            size: auto;
                            margin: 10mm;
                          }
                        }
                      `}</style>
                      <div id="printable-card-area" className="scale-85 sm:scale-100 origin-center py-4 bg-[#fbf9f5]/50 rounded-[32px] border border-dashed border-[#77574d]/10 px-6">
                        <FarmerCardVisual userData={tempUserData} lang={lang} />
                      </div>

                      <div className="flex flex-wrap justify-center gap-3 mt-6 print:hidden">
                        <button 
                          onClick={() => handleDownload('front')}
                          className="px-4 py-2.5 bg-[#122c1f]/5 border border-[#122c1f]/10 text-[#122c1f] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/10 transition shadow-sm"
                        >
                          <Download className="w-4 h-4 text-[#122c1f]" />
                          {lang === 'en' ? "Download Front" : "सामने का भाग डाउनलोड"}
                        </button>
                        <button 
                          onClick={() => handleDownload('back')}
                          className="px-4 py-2.5 bg-[#122c1f]/5 border border-[#122c1f]/10 text-[#122c1f] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/10 transition shadow-sm"
                        >
                          <Download className="w-4 h-4 text-[#122c1f]" />
                          {lang === 'en' ? "Download Back" : "पीछे का भाग डाउनलोड"}
                        </button>
                        <button 
                          onClick={handlePrint}
                          className="px-4 py-2.5 bg-[#122c1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/90 transition shadow-md"
                        >
                          <Printer className="w-4 h-4" />
                          {lang === 'en' ? "Print Card" : "कार्ड प्रिंट करें"}
                        </button>
                      </div>

                      <p className="text-[#77574d] text-xs mt-4 print:hidden text-center">
                        सफलतापूर्वक कार्ड जनरेट हो गया है! आप इसे यहाँ से डाउनलोड/प्रिंट कर सकते हैं या डैशबोर्ड से भी कर सकते हैं।<br/>
                        Your identity card has been successfully generated! You can download/print it from here or access it later in your dashboard.
                      </p>
                    </div>
                  );
                })()}

                <div className="w-full max-w-md bg-[#fbf9f5] p-6 rounded-2xl border border-[#77574d]/10 space-y-4">
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
              </m.div>
            ) : (
              <m.div
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
                        <m.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm"
                        >
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <p>{error}</p>
                        </m.div>
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
                            <m.div 
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
                            </m.div>
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
                        {/* Father Name */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">पिता / पति का नाम / Father / Husband Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.fatherName}
                              onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="e.g. Shyamlal Sharma"
                            />
                          </div>
                        </div>

                        {/* DOB */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">जन्म तिथि / Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="date"
                              value={formData.dob}
                              onChange={(e) => setFormData({...formData, dob: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                            />
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">लिंग / Gender</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <select
                              value={formData.gender}
                              onChange={(e) => setFormData({...formData, gender: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f] appearance-none"
                            >
                              <option value="Male">पुरुष / Male</option>
                              <option value="Female">महिला / Female</option>
                              <option value="Other">अन्य / Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Primary Crops */}
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

                        {/* State */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">राज्य / State</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.state}
                              onChange={(e) => setFormData({...formData, state: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="Uttar Pradesh"
                            />
                          </div>
                        </div>

                        {/* District */}
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

                        {/* Village */}
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

                        {/* Post Office */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">पोस्ट ऑफिस / Post Office</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.postOffice}
                              onChange={(e) => setFormData({...formData, postOffice: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="e.g. Malihabad"
                            />
                          </div>
                        </div>

                        {/* Pincode */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">पिनकोड / Pincode</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              pattern="[0-9]{6}"
                              maxLength={6}
                              value={formData.pincode}
                              onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="e.g. 226017"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
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
                      onClick={step === 3 ? processPayment : nextStep}
                      disabled={isSubmitting || paymentProcessing}
                      className="flex-2 py-4 px-6 bg-[#122c1f] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isSubmitting || paymentProcessing ? (
                        <m.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          {step === 1 && !otpSent ? (dict?.register?.send_otp || "Send OTP") : 
                           step === 1 && otpSent ? (dict?.register?.verify_otp || "Verify OTP") : 
                           step === 3 ? (dict?.register?.pay_securely || "Pay Securely") : (dict?.register?.continue || "Continue")}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
          <div id="recaptcha-container"></div>
        </div>
    </div>
  );
}
