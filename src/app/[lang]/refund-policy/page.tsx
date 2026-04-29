'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, XCircle, AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function RefundPolicyPage() {
  const { dict, lang } = useLanguage();

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
              {dict.footer.links.refunds}
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
            {/* Main Policy Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex gap-4"
            >
              <AlertCircle className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-[#122c1f] mb-2">
                  {lang === 'en' ? 'No Cancellation & No Refund Policy' : 'कोई रद्दीकरण और कोई वापसी नीति नहीं'}
                </h2>
                <p className="text-[#77574d] leading-relaxed">
                  {lang === 'en' 
                    ? 'At Kishan Seva Samiti, we strive to provide the best services to our farming community. Please note that once a membership is registered or a transaction is completed, there is no option for cancellation or refund.'
                    : 'किसान सेवा समिति में, हम अपने किसान समुदाय को सर्वोत्तम सेवाएं प्रदान करने का प्रयास करते हैं। कृपया ध्यान दें कि एक बार सदस्यता पंजीकृत होने या लेनदेन पूरा होने के बाद, रद्दीकरण या वापसी का कोई विकल्प नहीं है।'}
                </p>
              </div>
            </motion.div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#122c1f] mb-4 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-[#77574d]" />
                  {lang === 'en' ? 'Membership Fees' : 'सदस्यता शुल्क'}
                </h3>
                <p className="text-[#77574d] leading-relaxed text-lg">
                  {lang === 'en'
                    ? 'The one-time membership fee of ₹50 paid for the generation of the Digital Farmer ID Card is strictly non-refundable under any circumstances.'
                    : 'डिजिटल किसान आईडी कार्ड बनाने के लिए भुगतान किया गया ₹50 का एक बार का सदस्यता शुल्क किसी भी परिस्थिति में वापस नहीं किया जाएगा।'}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-[#122c1f] mb-4 flex items-center gap-3">
                  <RefreshCcw className="w-5 h-5 text-[#77574d]" />
                  {lang === 'en' ? 'Marketplace Transactions' : 'मार्केटप्लेस लेनदेन'}
                </h3>
                <p className="text-[#77574d] leading-relaxed text-lg">
                  {lang === 'en'
                    ? 'Transactions made for organic products in our marketplace are final. Since these involve perishable and agricultural goods directly from farmers, we do not accept cancellations or offer refunds once an order is placed.'
                    : 'हमारे मार्केटप्लेस में जैविक उत्पादों के लिए किए गए लेनदेन अंतिम हैं। चूंकि इनमें सीधे किसानों से खराब होने वाली और कृषि संबंधी वस्तुएं शामिल हैं, इसलिए हम ऑर्डर देने के बाद रद्दीकरण स्वीकार नहीं करते हैं या रिफंड की पेशकश नहीं करते हैं।'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 flex gap-4">
                <Info className="w-6 h-6 text-[#122c1f] shrink-0 mt-1" />
                <p className="text-[#77574d] text-sm italic">
                  {lang === 'en'
                    ? 'By completing a payment on our platform, you acknowledge and agree to this No Cancellation & No Refund policy.'
                    : 'हमारे प्लेटफॉर्म पर भुगतान पूरा करके, आप इस कोई रद्दीकरण और कोई वापसी नीति को स्वीकार करते हैं और सहमत होते हैं।'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-black/5 text-center">
            <p className="text-[#77574d]">
              {lang === 'en'
                ? 'For any clarifications, please contact support@kishanseva.org'
                : 'किसी भी स्पष्टीकरण के लिए, कृपया support@kishanseva.org पर संपर्क करें'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
