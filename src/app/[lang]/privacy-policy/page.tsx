'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicyPage() {
  const { dict, lang } = useLanguage();

  const sections = [
    {
      title: lang === 'en' ? '1. Information We Collect' : '1. जानकारी जो हम एकत्र करते हैं',
      content: lang === 'en'
        ? 'We collect personal information such as your name, mobile number, and farming details to provide membership benefits and generate your ID card.'
        : 'हम सदस्यता लाभ प्रदान करने और आपका आईडी कार्ड बनाने के लिए आपका नाम, मोबाइल नंबर और खेती के विवरण जैसी व्यक्तिगत जानकारी एकत्र करते हैं।'
    },
    {
      title: lang === 'en' ? '2. How We Use Your Information' : '2. हम आपकी जानकारी का उपयोग कैसे करते हैं',
      content: lang === 'en'
        ? 'Your information is used to verify your identity, process membership, and facilitate transactions in the organic marketplace.'
        : 'आपकी जानकारी का उपयोग आपकी पहचान सत्यापित करने, सदस्यता संसाधित करने और जैविक बाजार में लेनदेन की सुविधा के लिए किया जाता है।'
    },
    {
      title: lang === 'en' ? '3. Data Security' : '3. डेटा सुरक्षा',
      content: lang === 'en'
        ? 'We implement industry-standard security measures to protect your personal data from unauthorized access or disclosure.'
        : 'हम आपके व्यक्तिगत डेटा को अनधिकृत पहुंच या प्रकटीकरण से बचाने के लिए उद्योग-मानक सुरक्षा उपाय लागू करते हैं।'
    },
    {
      title: lang === 'en' ? '4. Third-Party Sharing' : '4. तृतीय-पक्ष साझाकरण',
      content: lang === 'en'
        ? 'We do not sell your personal data. We only share information with payment processors and service providers necessary to operate our platform.'
        : 'हम आपका व्यक्तिगत डेटा नहीं बेचते हैं। हम केवल भुगतान प्रोसेसर और सेवा प्रदाताओं के साथ जानकारी साझा करते हैं जो हमारे प्लेटफॉर्म को संचालित करने के लिए आवश्यक हैं।'
    },
    {
      title: lang === 'en' ? '5. Your Rights' : '5. आपके अधिकार',
      content: lang === 'en'
        ? 'You have the right to access, update, or request deletion of your personal information at any time through your dashboard.'
        : 'आपको अपने डैशबोर्ड के माध्यम से किसी भी समय अपनी व्यक्तिगत जानकारी तक पहुँचने, अपडेट करने या हटाने का अनुरोध करने का अधिकार है।'
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
              {dict.footer.links.privacy}
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
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
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
                ? 'For privacy concerns, reach out to privacy@kishanseva.org'
                : 'गोपनीयता संबंधी चिंताओं के लिए, privacy@kishanseva.org पर संपर्क करें'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
