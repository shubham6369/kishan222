'use client';

import React, { useState, useRef } from 'react';
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
  Share2, 
  Sprout, 
  CheckCircle2,
  Landmark,
  CreditCard,
  Mail,
  AlertCircle,
  Camera,
  Tractor,
  Printer
} from 'lucide-react';
import MembershipCard from './MembershipCard';
import { auth, db, storage } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSearchParams, useRouter } from 'next/navigation';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

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
  const referrerId = searchParams.get('ref');
  
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size must be less than 5MB');
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
        setStep(2);
      } catch (err: any) {
        console.error("OTP Error:", err);
        setError('Invalid OTP code. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError('Please enter a valid 6-digit OTP');
    }
  };

  const processPayment = async () => {
    setPaymentProcessing(true);
    setError('');
    try {
      // Step 1: Create Razorpay order on server
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50 }), // ₹50 membership fee
      });
      const orderData = await orderRes.json();
      if (!orderData.id) throw new Error('Failed to create payment order.');

      // Step 2: Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Kishan Seva Samiti',
        description: 'Farmer Membership Card — One-time Fee',
        order_id: orderData.id,
        handler: async (response: any) => {
          // Step 3: ONLY call handleSubmit after payment is confirmed
          await handleSubmit(response.razorpay_payment_id, orderData.id);
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },
        theme: { color: '#122c1f' },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            setError('Payment was cancelled. Please try again to complete your membership.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment initiation failed. Please try again.');
      setPaymentProcessing(false);
    }
  };

  const nextStep = async () => {
    setError('');
    if (step === 1) {
      if (!formData.fullName || !formData.phone || formData.phone.length < 10) {
        setError('Please enter a valid full name and mobile number.');
        return;
      }
      if (!otpSent) {
        setIsSubmitting(true);
        try {
          // Check for duplicate phone number
          const usersRef = collection(db, 'users');
          const normalizedPhone = formData.phone.replace(/\D/g, '');
          const q = query(usersRef, where('phone', '==', normalizedPhone));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            setError('This mobile number is already registered. Please login.');
            setIsSubmitting(false);
            return;
          }

          // Setup Recaptcha
          if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              size: 'invisible',
            });
          }
          
          const appVerifier = window.recaptchaVerifier;
          const phoneWithCode = `+91${normalizedPhone}`;
          
          // Check if using dummy keys
          if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes('dummy')) {
            throw new Error("DUMMY_KEYS_DETECTED: Please configure real Firebase keys in .env.local");
          }

          const confirmation = await signInWithPhoneNumber(auth, phoneWithCode, appVerifier);
          setConfirmationResult(confirmation);
          setOtpSent(true);
        } catch (err: any) {
          console.error("OTP Send Error Details:", err);
          
          let userMessage = 'Failed to send OTP. Please check your number and try again.';
          
          if (err.message?.includes('DUMMY_KEYS_DETECTED')) {
            userMessage = "Development Mode: Firebase dummy keys detected. Please add real credentials to .env.local to test SMS.";
          } else if (err.code === 'auth/invalid-phone-number') {
            userMessage = "Invalid phone number format. Please check and try again.";
          } else if (err.code === 'auth/quota-exceeded') {
            userMessage = "SMS quota exceeded for today. Please try again later.";
          } else if (err.code === 'auth/too-many-requests') {
            userMessage = "Too many attempts. Please wait a few minutes before trying again.";
          } else if (err.message) {
            userMessage = `Error: ${err.message}`;
          }

          setError(userMessage);
          
          // Reset recaptcha on error so they can try again
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = undefined;
          }
        } finally {
          setIsSubmitting(false);
        }
      } else {
        await verifyOTP();
      }
    } else if (step === 2) {
      if (!formData.village || !formData.district || !formData.crops || !formData.landSize) {
        setError('Please fill all farming details.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.password || formData.password.length < 6) {
        setError('Passcode must be at least 6 characters.');
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

  const handleSubmit = async (razorpayPaymentId: string, razorpayOrderId: string) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication session lost. Please restart.");

      // Link the password to their phone account using EmailAuthProvider proxy
      const emailProxy = `${formData.phone.replace(/\D/g, '')}@kishanseva.in`;
      
      try {
        const credential = EmailAuthProvider.credential(emailProxy, formData.password);
        await linkWithCredential(user, credential);
      } catch (err: any) {
        console.warn('Linking credential warning:', err);
      }

      await updateProfile(user, { displayName: formData.fullName });

      // Generate Membership ID
      const newMemberId = 'KSS-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      setMemberId(newMemberId);
      setReferralLink(`${window.location.origin}/register?ref=${newMemberId}`);

      // Upload Photo
      let finalPhotoUrl = formData.photoBase64;
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop() || 'jpg';
        const storageRef = ref(storage, `farmers/${user.uid}/profile_${Date.now()}.${fileExt}`);
        await uploadBytes(storageRef, photoFile);
        finalPhotoUrl = await getDownloadURL(storageRef);
      }

      const normalizedPhone = formData.phone.replace(/\D/g, '');

      // Store Farmer Data — only after payment is confirmed
      const userData = {
        uid: user.uid,
        fullName: formData.fullName,
        phone: normalizedPhone,
        email: emailProxy,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        crops: formData.crops,
        landSize: formData.landSize,
        photoUrl: finalPhotoUrl,
        photoBase64: finalPhotoUrl,
        membershipId: newMemberId,
        referralCode: newMemberId,
        referredBy: referrerId || null,
        registrationDate: new Date().toISOString(),
        // Payment confirmation — card is unlocked only because payment succeeded
        membershipFeePaid: 50,
        membershipCardUnlocked: true,
        paymentId: razorpayPaymentId,
        paymentOrderId: razorpayOrderId,
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
                referredUserName: formData.fullName,
                referredUserPhone: normalizedPhone,
                joinedAt: new Date().toISOString(),
                reward: 7,
                paymentConfirmed: true,
                paymentId: razorpayPaymentId,
              });
            }
          }
        } catch (refErr) {
          // Non-fatal: referral credit failure should not block the user's card
          console.error('Error rewarding referrer:', refErr);
        }
      }

      setStep('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
      setStep(3);
    } finally {
      setIsSubmitting(false);
      setPaymentProcessing(false);
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
                  {s.title}
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
                  <h2 className="text-3xl font-serif font-bold text-[#122c1f]">Transaction Successful!</h2>
                  <p className="text-[#77574d] text-sm">Your membership is registered. Print your card and share your link to earn ₹7 per referral.</p>
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
                      memberType: 'Farmer'
                    }}
                  />
                </div>

                <div className="w-full max-w-md bg-[#fbf9f5] p-6 rounded-2xl border border-[#77574d]/10 space-y-4 print:hidden">
                  <button 
                    onClick={handlePrint}
                    className="w-full py-4 bg-white border-2 border-[#122c1f] text-[#122c1f] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#122c1f]/5 transition-all"
                  >
                    <Printer className="w-5 h-5" />
                    Print Membership Card
                  </button>

                  <div className="pt-4 border-t border-black/5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#122c1f] mb-3">Your Referral link (Earn ₹7 per sign up)</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white px-4 py-3 rounded-xl border border-[#77574d]/20 text-xs font-mono truncate flex items-center">
                        {referralLink}
                      </div>
                      <button 
                        onClick={() => {
                            navigator.clipboard.writeText(referralLink);
                            alert('Link copied!');
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
                    Go to Dashboard
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
                        <h2 className="text-2xl font-serif font-bold text-[#122c1f]">Mobile Verification</h2>
                        <p className="text-sm text-[#77574d]">Register with your mobile number to get started.</p>
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
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="e.g. Ramesh Singh"
                              disabled={otpSent}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Phone Number</label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="9876543210"
                              disabled={otpSent}
                            />
                          </div>
                        </div>

                        <AnimatePresence>
                          {otpSent && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-2 pt-2"
                            >
                              <label className="text-[10px] font-bold uppercase tracking-widest text-green-700">Enter 6-Digit OTP</label>
                              <div className="relative">
                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600/50" />
                                <input
                                  type="text"
                                  maxLength={6}
                                  value={otpValue}
                                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                                  className="w-full pl-12 pr-4 py-4 bg-green-50 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 transition-all text-[#122c1f] font-mono tracking-[0.5em] text-lg"
                                  placeholder="------"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div id="recaptcha-container"></div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-[#122c1f]">Farming Profile</h2>
                        <p className="text-sm text-[#77574d]">Details for your official membership card.</p>
                      </div>
                      
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <div className="w-24 h-24 bg-[#fbf9f5] rounded-full border-2 border-dashed border-[#122c1f]/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#122c1f]/50">
                            {formData.photoBase64 ? (
                              <img src={formData.photoBase64} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <Camera className="w-8 h-8 text-[#122c1f]/30 group-hover:text-[#122c1f]/60" />
                            )}
                          </div>
                          <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full text-[10px] shadow-sm font-bold border border-[#122c1f]/10 whitespace-nowrap left-1/2 -translate-x-1/2">
                            Upload Photo
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
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Village</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.village}
                              onChange={(e) => setFormData({...formData, village: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="Your Village"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">District</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.district}
                              onChange={(e) => setFormData({...formData, district: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="Your District"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Primary Crops</label>
                          <div className="relative">
                            <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="text"
                              value={formData.crops}
                              onChange={(e) => setFormData({...formData, crops: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="e.g. Wheat, Rice"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Land Size (Acres)</label>
                          <div className="relative">
                            <Tractor className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/30" />
                            <input
                              type="number"
                              value={formData.landSize}
                              onChange={(e) => setFormData({...formData, landSize: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] border-none rounded-xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all text-[#122c1f]"
                              placeholder="e.g. 5.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-[#122c1f]">Set Passcode</h2>
                        <p className="text-sm text-[#77574d]">Create a secure PIN/password to log in to your portal.</p>
                      </div>
                      
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Secret Passcode</label>
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
                              placeholder="Minimum 6 characters"
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
                        <h2 className="text-3xl font-serif font-bold text-[#122c1f]">Membership Fee</h2>
                        <p className="text-sm text-[#77574d]">One-time fee to generate your Official Farmer ID Card.</p>
                      </div>
                      
                      <div className="p-6 bg-[#fbf9f5] rounded-2xl border border-black/5">
                        <div className="flex justify-between items-center pb-4 border-b border-black/5">
                          <span className="text-[#77574d]">Lifelong Membership Card</span>
                          <span className="font-bold text-[#122c1f]">₹50.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <span className="font-bold text-lg text-[#122c1f]">Total amount</span>
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
                        Back
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
                          {step === 1 && !otpSent ? 'Send OTP' : 
                           step === 1 && otpSent ? 'Verify OTP' : 
                           step === 4 ? 'Pay ₹50 securely' : 'Continue'}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
