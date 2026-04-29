'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { dict, lang } = useLanguage();

  const sections = [
    {
      title: lang === 'en' ? '1. Acceptance of Terms' : '1. शर्तों की स्वीकृति',
      content: lang === 'en' 
        ? 'By accessing and using this platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.'
        : 'इस प्लेटफॉर्म तक पहुंच बनाकर और इसका उपयोग करके, आप इन नियमों और शर्तों से बंधे होने के लिए सहमत हैं। यदि आप सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।'
    },
    {
      title: lang === 'en' ? '2. Membership & Eligibility' : '2. सदस्यता और पात्रता',
      content: lang === 'en'
        ? 'Membership is primarily for farmers and agricultural enthusiasts. Users must provide accurate information during registration.'
        : 'सदस्यता मुख्य रूप से किसानों और कृषि प्रेमियों के लिए है। उपयोगकर्ताओं को पंजीकरण के दौरान सटीक जानकारी प्रदान करनी होगी।'
    },
    {
      title: lang === 'en' ? '3. Membership Fee' : '3. सदस्यता शुल्क',
      content: lang === 'en'
        ? 'A one-time membership fee of ₹50 is required to generate the official Farmer ID Card. This fee is non-refundable.'
        : 'आधिकारिक किसान आईडी कार्ड बनाने के लिए ₹50 का एक बार सदस्यता शुल्क आवश्यक है। यह शुल्क वापस नहीं किया जाएगा।'
    },
    {
      title: lang === 'en' ? '4. Marketplace Usage' : '4. मार्केटप्लेस का उपयोग',
      content: lang === 'en'
        ? 'Verified members can list organic products. We reserve the right to remove any listings that violate our organic standards.'
        : 'सत्यापित सदस्य जैविक उत्पादों को सूचीबद्ध कर सकते हैं। हम हमारे जैविक मानकों का उल्लंघन करने वाली किसी भी लिस्टिंग को हटाने का अधिकार सुरक्षित रखते हैं।'
    },
    {
      title: lang === 'en' ? '5. Limitation of Liability' : '5. दायित्व की सीमा',
      content: lang === 'en'
        ? 'Kishan Seva Samiti is not liable for any direct or indirect damages arising from the use of this platform.'
        : 'किसान सेवा समिति इस प्लेटफॉर्म के उपयोग से होने वाले किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए उत्तरदायी नहीं है।'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      {/* Hero */}
      <section className="bg-[#122c1f] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 70% 50%, #77574d 0%, transparent 60%)',
        }} />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              {dict.footer.links.terms}
            </h1>
            <p className="text-white/70 text-lg">
              {lang === 'en' ? 'Last updated: April 2026' : 'अंतिम अपडेट: अप्रैल 2026'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5">
          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h2 className="text-2xl font-serif font-bold text-[#122c1f] mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-green-600" />
                  </div>
                  {section.title}
                </h2>
                <p className="text-[#77574d] leading-relaxed text-lg">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-black/5 text-center">
            <p className="text-[#77574d]">
              {lang === 'en' 
                ? 'For any questions regarding these terms, please contact us at support@kishanseva.org'
                : 'इन शर्तों के संबंध में किसी भी प्रश्न के लिए, कृपया support@kishanseva.org पर हमसे संपर्क करें'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
