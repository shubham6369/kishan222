'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Printer, Share2, Shield, CheckCircle2, QrCode,
  MapPin, Phone, Calendar, Leaf, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';

export default function FarmerCardPage() {
  const { userData, loading } = useAuth();
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = React.useState('');

  React.useEffect(() => {
    if (userData?.membershipId) {
      QRCode.toDataURL(
        `https://kishanseva.in/verify/${userData.membershipId}`,
        { width: 120, margin: 1, color: { dark: '#122c1f', light: '#fff' } }
      ).then(url => setQrDataUrl(url)).catch(console.error);
    }
  }, [userData?.membershipId]);

  const handlePrint = () => {
    const cardHtml = cardRef.current?.outerHTML || '';
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html><head><title>Farmer Membership Card</title>
        <style>
          body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fbf9f5; font-family: serif; }
          @media print { body { background: white; } }
        </style>
        </head><body>${cardHtml}</body></html>
      `);
      win.document.close();
      setTimeout(() => { win.print(); win.close(); }, 500);
    }
  };

  const handleDownload = () => {
    if (typeof window === 'undefined') return;
    // Open print dialog with just the card — browser can save as PDF
    handlePrint();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-[#122c1f]/20 border-t-[#122c1f] animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-lg mx-auto py-24 text-center px-6">
        <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-bold text-[#122c1f] mb-2">Not Registered Yet</h2>
        <p className="text-[#77574d] mb-8">You need to complete registration and pay the ₹50 membership fee to get your farmer card.</p>
        <Link href={`/${lang}/register`}
          className="px-8 py-4 bg-[#122c1f] text-white rounded-2xl font-bold hover:scale-105 transition-all"
        >
          Register Now
        </Link>
      </div>
    );
  }

  if (!userData.membershipCardUnlocked) {
    return (
      <div className="max-w-lg mx-auto py-24 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-orange-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#122c1f] mb-2">Card Locked</h2>
        <p className="text-[#77574d] mb-8">
          Complete the ₹50 membership fee payment to unlock your official Farmer Card.
        </p>
        <Link href={`/${lang}/register`}
          className="px-8 py-4 bg-[#122c1f] text-white rounded-2xl font-bold hover:scale-105 transition-all"
        >
          Complete Payment
        </Link>
      </div>
    );
  }

  const joinDate = userData.registrationDate
    ? new Date(userData.registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const expiryDate = userData.registrationDate
    ? new Date(new Date(userData.registrationDate).setFullYear(new Date(userData.registrationDate).getFullYear() + 1))
        .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d] mb-3">Official Document</p>
        <h1 className="text-4xl font-serif font-bold text-[#122c1f]">Your Farmer Membership Card</h1>
        <p className="text-[#77574d] mt-2">Valid ID card issued by Kishan Seva Samiti</p>
      </motion.div>

      {/* THE CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div
          ref={cardRef}
          className="w-full max-w-[420px] rounded-[28px] overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #122c1f 0%, #1e4a31 60%, #77574d 100%)' }}
        >
          {/* Card Front */}
          <div className="relative p-8 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white blur-2xl" />
            </div>

            {/* Header row */}
            <div className="relative z-10 flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Leaf className="w-4 h-4 text-green-400" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Kishan Seva Samiti</span>
                </div>
                <p className="text-[8px] uppercase tracking-widest text-white/40">Farmer Membership Card</p>
              </div>
              <div className="flex items-center gap-1 bg-green-400/20 px-3 py-1.5 rounded-full border border-green-400/30">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Verified</span>
              </div>
            </div>

            {/* Photo + Info */}
            <div className="relative z-10 flex gap-5 mb-6">
              {/* Photo */}
              <div className="shrink-0">
                {userData.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt={userData.fullName}
                    className="w-20 h-24 rounded-2xl object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-20 h-24 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl font-serif font-bold text-white">
                    {userData.fullName?.charAt(0) || '?'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest">Name</p>
                  <p className="font-bold text-white text-base leading-tight">{userData.fullName}</p>
                </div>
                <div>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest">Member ID</p>
                  <p className="font-mono font-bold text-green-400 text-sm">{userData.membershipId}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Village</p>
                    <p className="text-white text-xs font-medium">{userData.village || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">District</p>
                    <p className="text-white text-xs font-medium">{userData.district || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative z-10 border-t border-white/10 my-4" />

            {/* Bottom info + QR */}
            <div className="relative z-10 flex items-end justify-between">
              <div className="space-y-2">
                <div>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest">Crops</p>
                  <p className="text-white text-xs font-medium">{userData.crops || '—'}</p>
                </div>
                <div className="flex gap-3">
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Issued</p>
                    <p className="text-white text-xs">{joinDate}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/40 uppercase tracking-widest">Valid Until</p>
                    <p className="text-white text-xs">{expiryDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/40 text-[8px]">
                  <Phone className="w-2.5 h-2.5" />
                  {userData.phone || '—'}
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-xl p-1.5">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="w-16 h-16" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-[#122c1f]" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Back strip */}
          <div className="bg-black/30 px-8 py-3 flex items-center justify-between">
            <p className="text-[8px] text-white/30 font-mono">kishanseva.in/verify/{userData.membershipId}</p>
            <Shield className="w-4 h-4 text-white/20" />
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-[#122c1f] text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#122c1f]/20"
        >
          <Download className="w-5 h-5" />
          Download Card (PDF)
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-black/10 text-[#122c1f] rounded-2xl font-bold hover:shadow-md transition-all"
        >
          <Printer className="w-5 h-5" />
          Print Card
        </button>
        <button
          onClick={() => {
            const msg = encodeURIComponent(`🌾 My official Kishan Seva Samiti Farmer Card!\nID: ${userData.membershipId}\nVerify at: https://kishanseva.in/verify/${userData.membershipId}`);
            window.open(`https://wa.me/?text=${msg}`, '_blank');
          }}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-2xl font-bold hover:scale-105 transition-all"
        >
          <Share2 className="w-5 h-5" />
          Share on WhatsApp
        </button>
      </motion.div>

      {/* Info Note */}
      <div className="max-w-xl mx-auto bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 text-sm text-blue-800 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p>
          This card is your official identity as a registered Kishan Seva Samiti farmer. 
          Present it at mandis, cooperatives, or government offices to establish your verified farmer status. 
          The QR code can be scanned to verify authenticity online.
        </p>
      </div>
    </div>
  );
}
