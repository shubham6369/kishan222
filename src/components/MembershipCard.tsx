'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Landmark, ShieldCheck, MapPin, Phone, Sprout, Tractor, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MembershipCardProps {
  memberData: {
    fullName: string;
    membershipId: string;
    location: string;
    phone: string;
    crops: string;
    landSize: string;
    photoBase64?: string;
    registrationDate: string;
    expiryDate: string;
    memberType: 'Premium' | 'Regular' | 'Farmer';
  };
}

export default function MembershipCard({ memberData }: MembershipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Ensure the card fills the print view and maintains dimensions
      className="relative w-full max-w-md aspect-[1.586/1] rounded-[24px] overflow-hidden shadow-2xl group print:shadow-none print:break-inside-avoid membership-card"
    >
      {/* Background with Texture and Gradients */}
      <div className="absolute inset-0 bg-[#122c1f] overflow-hidden print:bg-[#122c1f] print:opacity-100" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        {/* Decorative Patterns */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-full bg-[#77574d]/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[80%] bg-[#fbf9f5]/5 blur-2xl rounded-full" />
        
        {/* Subtle Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
      </div>

      {/* Card Content Overlay */}
      <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between text-[#fbf9f5] z-10">
        
        {/* Card Header text */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#fbf9f5]/10 rounded-xl backdrop-blur-sm print:bg-white/20">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-[#fbf9f5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold tracking-tight">Kishan Seva Samiti</h3>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] opacity-60">Official Member</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-[#77574d]/30 backdrop-blur-md text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border border-[#77574d]/50 print:bg-[#77574d]/30">
              {memberData.memberType}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex justify-between items-end mt-4 gap-2">
          
          <div className="flex-1 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              {/* Photo Area */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-full shrink-0 border-2 border-white/20 overflow-hidden flex items-center justify-center">
                {memberData.photoBase64 ? (
                  <img src={memberData.photoBase64} alt="Farmer Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6 text-white/50" />
                )}
              </div>
              
              <div className="overflow-hidden">
                <h2 className="text-lg sm:text-2xl font-serif font-semibold tracking-wide capitalize truncate">
                  {memberData.fullName}
                </h2>
                <p className="text-[10px] sm:text-xs opacity-50 font-mono mt-0.5 truncate">ID: {memberData.membershipId}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 gap-x-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin className="w-3 h-3 opacity-40 shrink-0" />
                <span className="text-[9px] sm:text-[10px] opacity-70 truncate">{memberData.location}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Phone className="w-3 h-3 opacity-40 shrink-0" />
                <span className="text-[9px] sm:text-[10px] opacity-70 truncate">{memberData.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sprout className="w-3 h-3 opacity-40 shrink-0" />
                <span className="text-[9px] sm:text-[10px] opacity-70 truncate">{memberData.crops || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Tractor className="w-3 h-3 opacity-40 shrink-0" />
                <span className="text-[9px] sm:text-[10px] opacity-70 truncate">{memberData.landSize || '0'} Acres</span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-lg shrink-0 transform group-hover:scale-105 transition-transform print:translate-y-0">
            <QRCodeSVG 
              value={`https://kishanseva.in/verify/${memberData.membershipId}`} 
              size={56}
              level="H"
              includeMargin={false}
              fgColor="#122c1f"
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#fbf9f5]/10 flex justify-between items-center">
          <div className="flex gap-4">
            <div>
              <p className="text-[7px] sm:text-[8px] uppercase opacity-40 tracking-wider">Issued</p>
              <p className="text-[9px] sm:text-[10px] font-medium">{memberData.registrationDate}</p>
            </div>
            <div>
              <p className="text-[7px] sm:text-[8px] uppercase opacity-40 tracking-wider">Expires</p>
              <p className="text-[9px] sm:text-[10px] font-medium">{memberData.expiryDate}</p>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#fbf9f5]/20" />
        </div>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-[#fbf9f5]/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}
