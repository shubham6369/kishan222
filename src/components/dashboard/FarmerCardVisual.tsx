'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { UserData } from '@/types';

interface FarmerCardVisualProps {
  userData: UserData | null;
  lang: string;
}

// 1. Custom Private Society Security Shield Badge SVG (Replaces the state emblem)
const PrivateSecurityBadge = () => (
  <svg viewBox="0 0 100 100" className="w-[34px] h-[34px] text-[#d4af37] fill-current shrink-0 select-none">
    {/* Outer Shield */}
    <path d="M50 5 L85 18 V50 C85 70 70 88 50 95 C30 88 15 70 15 50 V18 Z" fill="none" stroke="#d4af37" strokeWidth="4.5" />
    {/* Inner Shield Fill */}
    <path d="M50 10 L80 21 V50 C80 67 67 83 50 90 C33 83 20 67 20 50 V21 Z" fill="#122c1f" />
    {/* Checkmark */}
    <path d="M35 50 L45 60 L65 38" fill="none" stroke="#d4af37" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    {/* Mini letters KSS */}
    <text x="50" y="76" textAnchor="middle" fill="#d4af37" fontSize="12" fontWeight="black" fontFamily="sans-serif" letterSpacing="1">KS</text>
  </svg>
);

// 2. Custom Farmer Collective Logo SVG
const FarmerLogo = ({ className = "w-[38px] h-[38px]", isWatermark = false }: { className?: string, isWatermark?: boolean }) => {
  if (isWatermark) {
    return (
      <svg viewBox="0 0 100 100" className={`${className} shrink-0 fill-current text-[#122c1f]/5 select-none pointer-events-none`}>
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4.5"/>
        <circle cx="50" cy="50" r="41" fill="currentColor" opacity="0.3"/>
        <path d="M35 34 C35 24 65 24 65 34 C60 30 40 30 35 34 Z" fill="currentColor" />
        <path d="M37 31 C37 25 63 25 63 31 C57 28 43 28 37 31 Z" fill="currentColor" opacity="0.6" />
        <circle cx="50" cy="41" r="9" fill="currentColor"/>
        <path d="M44 45 Q50 49 56 45 Q50 43 44 45 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M50 54 C35 54 28 62 28 72 V74 H72 V72 C72 62 65 54 50 54 Z" fill="currentColor"/>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={`${className} shrink-0 fill-current text-white select-none`}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="4.5"/>
      <circle cx="50" cy="50" r="41" fill="#122c1f"/>
      {/* Stylized Farmer Icon */}
      {/* Turban (Pagri) */}
      <path d="M35 34 C35 24 65 24 65 34 C60 30 40 30 35 34 Z" fill="#ffffff" />
      <path d="M37 31 C37 25 63 25 63 31 C57 28 43 28 37 31 Z" fill="#d4af37" />
      {/* Head */}
      <circle cx="50" cy="41" r="9" fill="#ffffff"/>
      {/* Mustache */}
      <path d="M44 45 Q50 49 56 45 Q50 43 44 45 Z" fill="#122c1f"/>
      {/* Body / Shoulders */}
      <path d="M50 54 C35 54 28 62 28 72 V74 H72 V72 C72 62 65 54 50 54 Z" fill="#ffffff"/>
      {/* Green T-Shirt Line */}
      <path d="M45 54 L50 62 L55 54 Z" fill="#122c1f" />
      {/* Mini wheat icon inside body */}
      <path d="M48 68 L50 64 L52 68 M50 64 V74" stroke="#122c1f" strokeWidth="1" fill="none" />
    </svg>
  );
};

// 3. Wheat Stalk Silhouette for Front Card Background
const WheatStalk = () => (
  <svg viewBox="0 0 60 160" className="w-[85px] h-[190px] absolute right-1 bottom-4 pointer-events-none select-none">
    {/* Main Stem */}
    <path 
      d="M15 150 C28 110, 32 70, 25 15" 
      stroke="#15803d" 
      strokeOpacity={0.10} 
      strokeWidth="2.5" 
      fill="none" 
      strokeLinecap="round"
    />
    {/* Wheat Grains */}
    <path d="M22 120 C18 114, 12 114, 9 122 C12 129, 18 129, 22 120 Z" fill="#15803d" fillOpacity={0.10} />
    <path d="M28 126 C32 120, 38 120, 41 128 C38 135, 32 135, 28 126 Z" fill="#15803d" fillOpacity={0.10} />
    <path d="M23 94 C19 88, 13 88, 10 96 C13 103, 19 103, 23 94 Z" fill="#15803d" fillOpacity={0.10} />
    <path d="M29 100 C33 94, 39 94, 42 102 C39 109, 33 109, 29 100 Z" fill="#15803d" fillOpacity={0.10} />
    <path d="M22 68 C18 62, 12 62, 9 70 C12 77, 18 77, 22 68 Z" fill="#15803d" fillOpacity={0.10} />
    <path d="M28 74 C32 68, 38 68, 41 76 C38 83, 32 83, 28 74 Z" fill="#15803d" fillOpacity={0.10} />
    <path d="M20 42 C16 36, 10 36, 7 44 C10 51, 16 51, 20 42 Z" fill="#15803d" fillOpacity={0.10} />
    <path d="M26 48 C30 42, 36 42, 39 50 C36 57, 30 57, 26 48 Z" fill="#15803d" fillOpacity={0.10} />
    <path d="M24 20 C21 14, 23 8, 25 8 C27 8, 28 14, 24 20 Z" fill="#15803d" fillOpacity={0.10} />
  </svg>
);

// 4. Plowing Farmer with Oxen Background SVG for Card Back
const PlowingBackdrop = () => (
  <svg viewBox="0 0 200 100" className="w-[170px] h-[85px] absolute bottom-8 right-2 pointer-events-none select-none">
    {/* Ox 1 (Back) */}
    <path d="M20 62 C 20 48, 38 43, 47 43 C 51 43, 55 46, 59 49 C 63 47, 68 49, 70 52 C 72 54, 72 57, 70 59 C 68 61, 63 63, 59 63 L 57 84 L 53 84 L 55 63 L 37 63 L 35 84 L 31 84 L 33 63 L 20 62 Z" fill="#166534" fillOpacity={0.05} />
    {/* Ox 2 (Front) */}
    <path d="M47 67 C 47 53, 64 48, 73 48 C 77 48, 81 51, 85 54 C 89 52, 94 54, 96 57 Q98 60, 96 62 C 93 64, 89 66, 85 66 L 83 87 L 79 87 L 81 66 L 64 66 L 62 87 L 58 87 L 60 66 L 47 67 Z" fill="#166534" fillOpacity={0.05} />
    {/* Connecting Harness bar */}
    <path d="M59 52 L 120 72" stroke="#166534" strokeOpacity={0.05} strokeWidth="1.8" fill="none"/>
    {/* The Plow blade */}
    <path d="M120 72 L 132 75 L 135 59 L 137 59 L 134 77 L 118 73 Z" fill="#166534" fillOpacity={0.05} />
    {/* Farmer silhouette */}
    <circle cx="145" cy="48" r="4.5" fill="#166534" fillOpacity={0.05} />
    <path d="M145 52.5 L 143 65 L 136 82 L 140 82 L 146 68 L 151 82 L 155 82 L 148 65 L 148 52.5 Z" fill="#166534" fillOpacity={0.05} />
    <path d="M145 57 L 134 60 M 145 57 L 134 67" stroke="#166534" strokeOpacity={0.05} strokeWidth="1.8" fill="none"/>
    {/* Ground Soil Line */}
    <line x1="5" y1="85" x2="190" y2="85" stroke="#166534" strokeOpacity={0.05} strokeWidth="1.2" strokeDasharray="4,4"/>
  </svg>
);

export default function FarmerCardVisual({ userData, lang }: FarmerCardVisualProps) {
  if (!userData) return null;

  // Verification URL for QR code
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${lang}/dashboard/card?id=${userData.membershipId}`
    : `https://kishanseva.in/verify-card?id=${userData.membershipId}`;

  // Date Formatter helper (DD/MM/YYYY)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
      }
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const verificationData = `--- KISHAN SEVA ---
MEMBER VERIFICATION

Member ID: ${userData.membershipId}
Name: ${userData.fullName}
Father/Husband: ${userData.fatherName || '—'}
DOB: ${formatDate(userData.dob) || '—'}
Gender: ${userData.gender || 'Male'}
Mobile: +91 ${userData.phone}
Address: ${userData.village || '—'}, Post ${userData.postOffice || '—'}, ${userData.district || '—'}, ${userData.state || 'Uttar Pradesh'} - ${userData.pincode || '—'}
Issue Date: ${formatDate(userData.registrationDate) || '01/05/2026'}
Status: Active Verified Member

Verify: ${verificationUrl}`;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center p-2 sm:p-6 print:p-0 print:flex-col print:gap-12 select-none">
      
      {/* -------------------- CARD FRONT -------------------- */}
      <div id="farmer-card-front" className="relative h-[260px] w-[420px] bg-white text-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 shadow-xl flex flex-col justify-between shrink-0 print:shadow-none print:border-black/30">
        
        {/* Wheat backdrop stalk */}
        <WheatStalk />
        
        {/* Solid Green Header Bar */}
        <div className="bg-[#122c1f] text-white px-4 py-2.5 flex justify-between items-center relative z-10 select-none">
          <div className="flex items-center gap-2">
            <FarmerLogo />
            <div className="leading-tight">
              <h3 className="font-serif text-sm font-extrabold tracking-wide text-white">सदस्य पहचान पत्र</h3>
              <p className="text-[9px] font-bold tracking-widest text-[#d4af37] uppercase">MEMBER IDENTITY CARD</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center pr-1 select-none">
            <PrivateSecurityBadge />
          </div>
        </div>

        {/* Card Body Profile Area */}
        <div className="flex-1 px-4 py-3 flex gap-4 items-center relative z-0">
          
          {/* Logo Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <FarmerLogo className="w-[140px] h-[140px]" isWatermark={true} />
          </div>
          
          {/* Farmer Photo */}
          <div className="w-[100px] h-[120px] rounded-lg bg-zinc-50 border border-zinc-300 overflow-hidden relative shrink-0 flex items-center justify-center shadow-inner">
            {userData.photoUrl || userData.photoBase64 ? (
              <Image 
                src={(() => {
                  const url = userData.photoUrl || userData.photoBase64 || '';
                  if (url.startsWith('data:')) return url;
                  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
                })()} 
                alt={userData.fullName} 
                fill
                sizes="100px"
                className="object-cover object-center"
                unoptimized
              />
            ) : (
              <span className="text-4xl select-none">👨‍🌾</span>
            )}
          </div>

          {/* User Details Grid */}
          <div className="flex-1 min-w-0 space-y-1.5 text-[#122c1f]">
            {/* Name */}
            <div>
              <p className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold leading-none">किसान का नाम / Name</p>
              <h4 className="text-xs font-serif font-black truncate leading-tight mt-0.5">{userData.fullName}</h4>
            </div>

            {/* Father's Name */}
            <div>
              <p className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold leading-none">पिता / पति का नाम / Father / Husband Name</p>
              <p className="text-[10px] font-bold truncate leading-tight mt-0.5">{userData.fatherName || '—'}</p>
            </div>

            {/* Side-by-side Details */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
              <div>
                <p className="text-[7px] uppercase tracking-wider text-zinc-500 font-bold leading-none">जन्म तिथि / DOB</p>
                <p className="text-[9px] font-bold font-mono leading-none mt-0.5">{formatDate(userData.dob) || '—'}</p>
              </div>
              <div>
                <p className="text-[7px] uppercase tracking-wider text-zinc-500 font-bold leading-none">लिंग / Gender</p>
                <p className="text-[9px] font-bold leading-none mt-0.5">{userData.gender === 'Female' ? 'महिला / Female' : userData.gender === 'Other' ? 'अन्य / Other' : 'पुरुष / Male'}</p>
              </div>
              <div>
                <p className="text-[7px] uppercase tracking-wider text-zinc-500 font-bold leading-none">राज्य / State</p>
                <p className="text-[9px] font-bold leading-none mt-0.5">{userData.state || 'Uttar Pradesh'}</p>
              </div>
              <div>
                <p className="text-[7px] uppercase tracking-wider text-zinc-500 font-bold leading-none">जिला / District</p>
                <p className="text-[9px] font-bold truncate leading-none mt-0.5">{userData.district || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Front Footer Block with QR & ID */}
        <div className="border-t border-zinc-200 px-4 py-2 flex justify-between items-center bg-zinc-50 relative z-10 select-none">
          <div className="leading-tight">
            <p className="text-[7px] uppercase tracking-widest text-zinc-500 font-bold">सदस्य संख्या / Member ID</p>
            <p className="font-mono font-black text-[#122c1f] text-xs leading-none mt-0.5 tracking-wider">{userData.membershipId}</p>
          </div>
          
          <div className="flex items-center gap-2 select-none">
            <span className="text-[7px] text-right font-extrabold text-[#122c1f] uppercase tracking-wider leading-tight">
              सदस्यता सत्यापन<br />
              <span className="text-zinc-500 font-normal">Member Verify</span>
            </span>
            <div className="w-[44px] h-[44px] bg-white rounded border border-zinc-200 p-0.5 shrink-0 flex items-center justify-center shadow-sm select-none">
              <QRCodeSVG 
                value={verificationData}
                size={38}
                level="L"
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- CARD BACK -------------------- */}
      <div id="farmer-card-back" className="relative h-[260px] w-[420px] bg-white text-[#122c1f] rounded-2xl overflow-hidden border border-zinc-200 shadow-xl flex flex-col justify-between shrink-0 print:shadow-none print:border-black/30">
        
        {/* Ox plowing farmer backdrop */}
        <PlowingBackdrop />
        
        {/* Solid Green Header Bar */}
        <div className="bg-[#122c1f] text-white px-4 py-3 select-none">
          <h3 className="font-serif text-xs font-extrabold tracking-widest text-center select-none uppercase">किसान सेवा / KISHAN SEVA</h3>
        </div>

        {/* Card Back Content Info List */}
        <div className="flex-1 px-5 py-4 flex flex-col justify-between relative z-0">
          
          {/* Logo Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <FarmerLogo className="w-[140px] h-[140px]" isWatermark={true} />
          </div>
          
          <div className="space-y-3">
            {/* Address */}
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-[#122c1f]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs select-none">📍</span>
              </div>
              <div className="leading-tight max-w-[310px]">
                <p className="text-[7px] uppercase tracking-widest text-zinc-500 font-bold">पता / Address</p>
                <p className="text-[10px] font-bold mt-0.5 truncate-3-lines leading-snug">
                  ग्राम - {userData.village || '—'}, पोस्ट - {userData.postOffice || '—'}, जिला - {userData.district || '—'}, {userData.state || 'Uttar Pradesh'} - {userData.pincode || '—'}
                </p>
              </div>
            </div>

            {/* Mobile Number */}
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-[#122c1f]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs select-none">📞</span>
              </div>
              <div className="leading-tight">
                <p className="text-[7px] uppercase tracking-widest text-zinc-500 font-bold">मोबाइल नंबर / Mobile No.</p>
                <p className="text-[10px] font-mono font-bold mt-0.5">+91 {userData.phone}</p>
              </div>
            </div>

            {/* Date of Issue */}
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-[#122c1f]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs select-none">📅</span>
              </div>
              <div className="leading-tight">
                <p className="text-[7px] uppercase tracking-widest text-zinc-500 font-bold">जारी करने की तिथि / Date of Issue</p>
                <p className="text-[10px] font-mono font-bold mt-0.5">{formatDate(userData.registrationDate) || '01/05/2026'}</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Solid Green Footer Bar with Legal text & Helpline */}
        <div className="bg-[#122c1f] text-white px-3 py-2 flex justify-between items-center text-[7px] select-none">
          <span className="leading-snug max-w-[270px] font-medium text-left opacity-90 select-none">
            यह कार्ड किसान सेवा द्वारा जारी सदस्य पहचान का प्रमाण है।<br />
            This card is a member identity proof issued by Kishan Seva.
          </span>
          <div className="flex items-center gap-1 font-bold shrink-0 opacity-100 select-none">
            <span className="text-lg leading-none select-none">📞</span>
            <div className="leading-tight">
              <p className="text-[6px] leading-none uppercase select-none opacity-80 text-right">हेल्पलाइन / Helpline</p>
              <p className="font-mono text-[8px] leading-none mt-0.5 select-none text-right">1800-180-1551</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
