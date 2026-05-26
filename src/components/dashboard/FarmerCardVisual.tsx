'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Sprout, Tractor, Phone, CreditCard, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { UserData } from '@/types';

interface FarmerCardVisualProps {
  userData: UserData | null;
  lang: string;
}

export default function FarmerCardVisual({ userData, lang }: FarmerCardVisualProps) {
  if (!userData) return null;

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${lang}/dashboard/card?id=${userData.membershipId}`
    : `https://kishanseva.in/verify-card?id=${userData.membershipId}`;

  const isVerified = userData.isAdmin || userData.walletBalance !== undefined; // standard verified logic or custom verification status in firestore

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center p-2 sm:p-6 print:p-0 print:flex-col print:gap-12">
      
      {/* CARD FRONT */}
      <div className="relative w-full max-w-[350px] aspect-[1.586/1] sm:aspect-auto sm:h-[220px] sm:w-[350px] bg-[#122c1f] text-white rounded-2xl overflow-hidden border border-white/10 shadow-xl flex flex-col justify-between p-5 shrink-0 print:shadow-none print:border-black/20">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_60%)]"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        {/* Card Header */}
        <div className="relative flex justify-between items-start border-b border-white/10 pb-3">
          <div>
            <h3 className="font-serif text-base font-black tracking-tight text-white leading-none">Kishan Seva Samiti</h3>
            <p className="text-[6px] uppercase tracking-[0.2em] text-accent font-black mt-1">Smart Farmer Identity Card</p>
          </div>
          <div className="flex items-center gap-1.5 bg-accent/15 border border-accent/20 px-2 py-0.5 rounded-full shrink-0">
            <ShieldCheck className="w-2.5 h-2.5 text-accent" />
            <span className="text-[6px] font-black uppercase tracking-wider text-accent">
              {lang === 'hi' ? 'सत्यापित सदस्य' : 'Verified Member'}
            </span>
          </div>
        </div>

        {/* Card Core Profile Info */}
        <div className="relative flex gap-4 items-center my-auto">
          <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 overflow-hidden relative shrink-0 flex items-center justify-center">
            {userData.photoUrl || userData.photoBase64 ? (
              <Image 
                src={userData.photoUrl || userData.photoBase64 || ''} 
                alt={userData.fullName} 
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-2xl">👨‍🌾</span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[6px] uppercase tracking-widest text-white/40 font-bold leading-none">Name / नाम</p>
            <h4 className="text-sm font-bold font-serif text-white truncate max-w-[150px] leading-tight">{userData.fullName}</h4>
            <p className="text-[6px] uppercase tracking-widest text-white/40 font-bold leading-none mt-1.5">Member ID / सदस्य संख्या</p>
            <p className="font-mono font-bold text-accent text-[9px] leading-none">{userData.membershipId}</p>
          </div>
        </div>

        {/* Card Front Footer with QR */}
        <div className="relative border-t border-white/10 pt-2.5 flex justify-between items-center gap-2">
          <div className="space-y-0.5">
            <p className="text-[5px] uppercase tracking-widest text-white/30 font-bold leading-none">Live Verification</p>
            <p className="text-[7px] text-white/50 font-body leading-none">Scan to verify farmer credentials</p>
          </div>
          <div className="w-9 h-9 bg-white rounded-lg p-0.5 shrink-0 flex items-center justify-center shadow-md">
            <QRCodeSVG 
              value={verificationUrl}
              size={36}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>
      </div>

      {/* CARD BACK */}
      <div className="relative w-full max-w-[350px] aspect-[1.586/1] sm:aspect-auto sm:h-[220px] sm:w-[350px] bg-[#fbf9f5] text-[#122c1f] rounded-2xl overflow-hidden border border-[#122c1f]/10 shadow-xl flex flex-col justify-between p-5 shrink-0 print:shadow-none print:border-black/20">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(18,44,31,0.03),transparent_50%)]"></div>
        
        {/* Card Header Back */}
        <div className="relative flex justify-between items-center border-b border-[#122c1f]/10 pb-2">
          <div className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-[#122c1f]" />
            <span className="text-[8px] font-black uppercase tracking-wider text-[#122c1f]">Card Details</span>
          </div>
          <span className="text-[7px] text-[#77574d] font-bold">
            {lang === 'hi' ? 'जारी तिथि:' : 'Issued:'} {userData.registrationDate ? new Date(userData.registrationDate).toLocaleDateString('en-IN') : '2026'}
          </span>
        </div>

        {/* Card details list */}
        <div className="relative grid grid-cols-2 gap-y-3 gap-x-2 my-auto text-xs py-1">
          <div className="space-y-0.5">
            <p className="text-[6px] uppercase tracking-widest text-[#77574d] font-bold leading-none">Mobile / मोबाइल</p>
            <p className="font-mono font-bold text-[#122c1f] text-[9px] flex items-center gap-1 leading-none">
              <Phone className="w-2.5 h-2.5 text-[#77574d]/50 shrink-0" />
              +91 {userData.phone}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[6px] uppercase tracking-widest text-[#77574d] font-bold leading-none">Land Size / भूमि</p>
            <p className="font-bold text-[#122c1f] text-[9px] flex items-center gap-1 leading-none">
              <Tractor className="w-2.5 h-2.5 text-[#77574d]/50 shrink-0" />
              {userData.landSize} Acres
            </p>
          </div>
          <div className="space-y-0.5 col-span-2">
            <p className="text-[6px] uppercase tracking-widest text-[#77574d] font-bold leading-none">Address / पता</p>
            <p className="font-bold text-[#122c1f] text-[9px] flex items-center gap-1 leading-tight truncate">
              <MapPin className="w-2.5 h-2.5 text-[#77574d]/50 shrink-0" />
              {userData.village}, {userData.district}, {userData.state}
            </p>
          </div>
          <div className="space-y-0.5 col-span-2">
            <p className="text-[6px] uppercase tracking-widest text-[#77574d] font-bold leading-none">Crops Grown / प्रमुख फसलें</p>
            <p className="font-bold text-emerald-800 text-[9px] flex items-center gap-1 leading-tight truncate">
              <Sprout className="w-2.5 h-2.5 text-emerald-800/50 shrink-0" />
              {userData.crops}
            </p>
          </div>
        </div>

        {/* Card Back Footer */}
        <div className="relative border-t border-[#122c1f]/10 pt-2 flex justify-between items-center text-[5px] text-[#77574d]/70 font-bold leading-none uppercase">
          <span>Kishan Seva Samiti Collective</span>
          <span>sandeepkumarchauhan805@gmail.com</span>
        </div>
      </div>

    </div>
  );
}
