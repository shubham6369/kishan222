'use client';

import React from 'react';
import { m } from 'framer-motion';
import { 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Dictionary } from '@/context/LanguageContext';
import FadeIn from '../animations/FadeIn';

interface CardFeaturesProps {
  lang: string;
  dict?: Dictionary;
}

export default function CardFeatures({ lang }: CardFeaturesProps) {


  return (
    <section className="py-24 bg-[#fbf9f5] relative overflow-hidden border-t border-black/5">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
        
        {/* Section Title */}
        <FadeIn className="text-center max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#77574d] bg-[#77574d]/5 px-4 py-2 rounded-full">
            {lang === 'en' ? "DIGNITY & INCOME FOR FARMERS" : "किसानों के लिए सम्मान और आय"}
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#122c1f]">
            {lang === 'en' ? "Your Official Digital Identity" : "आपकी आधिकारिक डिजिटल पहचान"}
          </h2>
          <p className="text-[#77574d] font-body text-lg leading-relaxed">
            {lang === 'en' 
              ? "Become a verified member of Kishan Seva. Get your Smart ID card, secure special support benefits, and access our direct agricultural marketplace."
              : "किसान सेवा के एक सत्यापित सदस्य बनें। अपना स्मार्ट आईडी कार्ड प्राप्त करें, विशेष सहायता लाभ सुरक्षित करें, और हमारे प्रत्यक्ष कृषि बाजार तक पहुंचें।"}
          </p>
        </FadeIn>

        {/* Visual Card Showcase & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Card Mockup View */}
          <div className="lg:col-span-5 flex justify-center [perspective:1000px]">
            <FadeIn direction="right" className="w-full max-w-[340px] relative group">
              {/* Glow Behind */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-[36px] blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* ID Card Front */}
              <m.div 
                whileHover={{ 
                  y: -10, 
                  rotateY: 8, 
                  rotateX: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-[#122c1f] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl p-6 text-white space-y-6 flex flex-col justify-between aspect-[3/4.5] w-full cursor-pointer select-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                
                {/* Decorative textures */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_60%)]"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

                {/* Header */}
                <div className="relative flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold tracking-tight text-white">Kishan Seva</h3>
                    <p className="text-[7px] uppercase tracking-[0.25em] text-accent font-black">Digital Farmer ID</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-accent/20 text-accent rounded-full text-[6px] font-black uppercase tracking-wider border border-accent/20">
                      Verified Member
                    </span>
                  </div>
                </div>

                {/* Farmer Photo & Core Info */}
                <div className="relative flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 overflow-hidden relative shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#77574d]/40 flex items-center justify-center text-3xl">👨‍🌾</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Member Name</p>
                    <h4 className="text-base font-bold font-serif text-white">Ramesh Singh</h4>
                    <div className="flex items-center gap-1 text-[9px] text-accent font-bold">
                      <Calendar className="w-3 h-3" />
                      <span>Joined May 2026</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="relative grid grid-cols-2 gap-y-4 gap-x-2 border-t border-white/10 pt-4 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[7px] uppercase tracking-widest text-white/40 font-bold">Membership ID</p>
                    <p className="font-mono font-bold text-accent text-[10px]">KSS-48A9DF</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[7px] uppercase tracking-widest text-white/40 font-bold">Mobile Number</p>
                    <p className="font-bold text-white text-[10px]">+91 98765 43210</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[7px] uppercase tracking-widest text-white/40 font-bold">Village & District</p>
                    <p className="font-bold text-white text-[10px] truncate">Mahoba, Mahoba</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[7px] uppercase tracking-widest text-white/40 font-bold">Aadhaar Number</p>
                    <p className="font-bold text-white text-[10px] truncate">1234 5678 9012</p>
                  </div>
                </div>

                {/* Card Footer with QR code mockup */}
                <div className="relative border-t border-white/10 pt-4 flex justify-between items-center gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[6px] uppercase tracking-widest text-white/30 font-bold">Official Verification</p>
                    <p className="text-[8px] text-white/60 font-body leading-tight">Scan QR code to verify live credentials</p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center shadow-lg">
                    {/* Mock QR SVG */}
                    <svg className="w-full h-full text-primary" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M0 0h30v30H0zm10 10v10h10V10zm20-10h10v10H30zm10 0h20v10H40zm20 0h10v10H60zm10 0h30v30H70zm10 10v10h10V10zM0 40h10v10H0zm10 0h10v10H10zm20 0h10v10H30zm10 0h10v10H40zm30 0h10v10H70zm20 0h10v10H90zM0 70h30v30H0zm10 10v10h10V80zm20-10h10v10H30zm20 0h10v10H50zm10 0h10v10H60zm10 0h10v10H70zm20 0h10v10H90zm-40 10h10v10H50zm10 0h10v10H60zm20 0h10v10H80zm-40 10h10v10H40zm20 0h10v10H60zm10 0h10v10H70z" />
                    </svg>
                  </div>
                </div>
              </m.div>
            </FadeIn>
          </div>

          {/* Details List */}
          <div className="lg:col-span-7 space-y-8">
            <FadeIn direction="left" className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#122c1f]">
                {lang === 'en' ? "What is the Smart Farmer ID?" : "स्मार्ट किसान आईडी क्या है?"}
              </h3>
              <p className="text-[#77574d] text-sm leading-relaxed">
                {lang === 'en'
                  ? "It's an official digital certificate for Indian farmers that establishes your identity within the Kishan Seva collective. The card has a unique, secure database ID and a scan-to-verify QR code that lets anyone confirm your active membership status instantly."
                  : "यह भारतीय किसानों के लिए एक आधिकारिक डिजिटल प्रमाणपत्र है जो किसान सेवा सामूहिक के भीतर आपकी पहचान स्थापित करता है। कार्ड में एक विशिष्ट, सुरक्षित डेटाबेस आईडी और स्कैन-टू-वेरिफाई क्यूआर कोड है जो किसी को भी आपके सक्रिय सदस्यता स्थिति की तुरंत पुष्टि करने की अनुमति देता है।"}
              </p>
            </FadeIn>

            {/* Grid of details included */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: lang === 'en' ? "Farmer Photo & Name" : "किसान की फोटो और नाम", desc: lang === 'en' ? "High-res portrait and full legal name." : "हाई-रेजोल्यूशन पोर्ट्रेट और पूरा कानूनी नाम।" },
                { title: lang === 'en' ? "Identity Specifications" : "पहचान के विशिष्ट विवरण", desc: lang === 'en' ? "Village, district, Aadhaar number, and basic details." : "गांव, जिला, आधार नंबर और बुनियादी विवरण।" },
                { title: lang === 'en' ? "Verification QR Code" : "सत्यापन क्यूआर कोड", desc: lang === 'en' ? "Live, secure database verification scanner." : "लाइव, सुरक्षित डेटाबेस सत्यापन स्कैनर।" },
                { title: lang === 'en' ? "Download & Print Ready" : "डाउनलोड और प्रिंट के लिए तैयार", desc: lang === 'en' ? "Standard card dimensions ready to print as PVC card." : "मानक कार्ड आयाम पीवीसी कार्ड के रूप में प्रिंट करने के लिए तैयार।" }
              ].map((item, idx) => (
                <FadeIn 
                  key={idx} 
                  delay={idx * 0.05} 
                  whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex gap-3 items-start bg-white p-5 rounded-2xl border border-black/5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#122c1f]">{item.title}</h4>
                    <p className="text-xs text-[#77574d] leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>



      </div>
    </section>
  );
}
