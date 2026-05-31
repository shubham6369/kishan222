'use client';

import React from 'react';
import { m } from 'framer-motion';
import { Printer, Info, CreditCard, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Dictionary } from '@/context/LanguageContext';
import FarmerCardVisual from './FarmerCardVisual';

interface CardContentProps {
  lang: string;
  dict: Dictionary;
}

export default function CardContent({ lang, dict }: CardContentProps) {
  const { userData, loading } = useAuth();

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
      link.download = `Farmer_ID_${side === 'front' ? 'Front' : 'Back'}_${userData?.membershipId || 'Card'}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating card image:', err);
      alert('Failed to download card. Please try using print to save as PDF.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <m.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#122c1f]/10 border-t-[#122c1f] rounded-full"
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-black/5 max-w-md mx-auto mt-12 space-y-4">
        <CreditCard className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-[#122c1f]">Access Denied</h3>
        <p className="text-sm text-[#77574d]">Please log in to view your membership card.</p>
        <Link href={`/${lang}/login`} className="btn-premium w-full text-center">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Print styles injection */}
      <style>{`
        @media print {
          /* Hide everything */
          body * {
            visibility: hidden !important;
          }
          /* Show only the card container and its descendants */
          #printable-card-area, #printable-card-area * {
            visibility: visible !important;
          }
          /* Absolute position card area for clean alignment */
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
          }
          /* Disable page margins / headers / footers */
          @page {
            size: auto;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Header controls (hidden on print) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 print:hidden">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#122c1f]">
            {lang === 'en' ? "Farmer ID Card" : "किसान पहचान पत्र"}
          </h1>
          <p className="text-[#77574d] mt-1 font-medium">
            {lang === 'en' 
              ? "Download or print your official Kishan Seva membership card." 
              : "अपने आधिकारिक किसान सेवा सदस्यता कार्ड को डाउनलोड या प्रिंट करें।"}
          </p>
        </div>

        <div className="flex gap-3">
          <Link 
            href={`/${lang}/dashboard`}
            className="px-5 py-3.5 bg-white border border-black/5 rounded-2xl text-xs font-bold uppercase tracking-wider text-[#122c1f] flex items-center gap-2 hover:bg-[#fbf9f5] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'en' ? "Back" : "पीछे"}
          </Link>
          <button 
            onClick={handlePrint}
            className="px-6 py-3.5 bg-[#122c1f] text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/90 transition shadow-md"
          >
            <Printer className="w-4 h-4" />
            {lang === 'en' ? "Print ID Card" : "आईडी कार्ड प्रिंट करें"}
          </button>
        </div>
      </div>

      {/* Main card view area */}
      <div className="bg-white rounded-[40px] border border-black/5 shadow-sm p-8 sm:p-12 space-y-12">
        
        {/* Printable Card Area */}
        <div id="printable-card-area" className="flex justify-center py-4 bg-[#fbf9f5]/50 rounded-[32px] border border-dashed border-[#77574d]/10">
          <FarmerCardVisual userData={userData} lang={lang} />
        </div>

        {/* Download Buttons Panel */}
        <div className="flex flex-wrap justify-center gap-4 print:hidden -mt-6">
          <button 
            onClick={() => handleDownload('front')}
            className="px-5 py-3.5 bg-[#122c1f]/5 border border-[#122c1f]/10 text-[#122c1f] rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/10 transition shadow-sm"
          >
            <Download className="w-4.5 h-4.5 text-[#122c1f]" />
            {lang === 'en' ? "Download Front Side (PNG)" : "सामने का भाग डाउनलोड करें (PNG)"}
          </button>
          <button 
            onClick={() => handleDownload('back')}
            className="px-5 py-3.5 bg-[#122c1f]/5 border border-[#122c1f]/10 text-[#122c1f] rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/10 transition shadow-sm"
          >
            <Download className="w-4.5 h-4.5 text-[#122c1f]" />
            {lang === 'en' ? "Download Back Side (PNG)" : "पीछे का भाग डाउनलोड करें (PNG)"}
          </button>
        </div>

        {/* Instructions Panel (hidden on print) */}
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-4 print:hidden">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-blue-900">
              {lang === 'en' ? "How to print your Farmer ID Card:" : "अपना किसान आईडी कार्ड कैसे प्रिंट करें:"}
            </h4>
            <ul className="text-xs text-blue-800 space-y-1.5 list-disc pl-4 font-body leading-relaxed">
              <li>{lang === 'en' 
                ? "Click the 'Print ID Card' button above to open the print options." 
                : "प्रिंट विकल्प खोलने के लिए ऊपर दिए गए 'आईडी कार्ड प्रिंट करें' बटन पर क्लिक करें।"}</li>
              <li>{lang === 'en' 
                ? "Set layout to 'Portrait' and select your destination printer (or choose 'Save as PDF')." 
                : "लेआउट को 'पोर्ट्रेट' पर सेट करें और अपने गंतव्य प्रिंटर का चयन करें (या 'पीडीएफ के रूप में सहेजें' चुनें)।"}</li>
              <li>{lang === 'en' 
                ? "Enable 'Background graphics' in the print settings to ensure the card design prints properly." 
                : "यह सुनिश्चित करने के लिए कि कार्ड डिज़ाइन ठीक से प्रिंट हो, प्रिंट सेटिंग्स में 'पृष्ठभूमि ग्राफिक्स (Background graphics)' सक्षम करें।"}</li>
              <li>{lang === 'en' 
                ? "Print on standard card paper or PVC card sheets for best durability." 
                : "सर्वोत्तम टिकाऊपन के लिए मानक कार्ड पेपर या पीवीसी कार्ड शीट पर प्रिंट करें।"}</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
