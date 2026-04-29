'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ShippingPolicyPage() {
  const { dict, lang } = useLanguage();

  const sections = [
    {
      title: lang === 'en' ? '1. Shipping Coverage' : '1. शिपिंग कवरेज',
      content: lang === 'en'
        ? 'We currently deliver organic products across selected districts in Rajasthan. We are expanding our network to cover more regions soon.'
        : 'हम वर्तमान में राजस्थान के चुनिंदा जिलों में जैविक उत्पादों की डिलीवरी करते हैं। हम जल्द ही और अधिक क्षेत्रों को कवर करने के लिए अपने नेटवर्क का विस्तार कर रहे हैं।'
    },
    {
      title: lang === 'en' ? '2. Delivery Timelines' : '2. डिलीवरी समयरेखा',
      content: lang === 'en'
        ? 'Orders are typically processed within 24-48 hours. Delivery usually takes 3-7 business days depending on the location and the nature of the agricultural product.'
        : 'ऑर्डर आमतौर पर 24-48 घंटों के भीतर संसाधित किए जाते हैं। डिलीवरी में आमतौर पर स्थान और कृषि उत्पाद की प्रकृति के आधार पर 3-7 कार्य दिवस लगते हैं।'
    },
    {
      title: lang === 'en' ? '3. Shipping Charges' : '3. शिपिंग शुल्क',
      content: lang === 'en'
        ? 'Shipping charges are calculated at checkout based on the weight of the items and the delivery distance. Free shipping may be available for certain order values.'
        : 'शिपिंग शुल्क की गणना चेकआउट के समय वस्तुओं के वजन और डिलीवरी की दूरी के आधार पर की जाती है। कुछ ऑर्डर मूल्यों के लिए मुफ्त शिपिंग उपलब्ध हो सकती है।'
    },
    {
      title: lang === 'en' ? '4. Order Tracking' : '4. ऑर्डर ट्रैकिंग',
      content: lang === 'en'
        ? 'Once your order is dispatched, you will receive a tracking link via SMS or through your dashboard to monitor the status of your delivery.'
        : 'एक बार आपका ऑर्डर भेज दिए जाने के बाद, आपको अपनी डिलीवरी की स्थिति की निगरानी के लिए एसएमएस के माध्यम से या अपने डैशबोर्ड के माध्यम से एक ट्रैकिंग लिंक प्राप्त होगा।'
    },
    {
      title: lang === 'en' ? '5. Damage during Transit' : '5. पारगमन के दौरान नुकसान',
      content: lang === 'en'
        ? 'If you receive a product in damaged condition, please report it to our support team within 24 hours of delivery with photographic evidence.'
        : 'यदि आपको क्षतिग्रस्त स्थिति में उत्पाद प्राप्त होता है, तो कृपया डिलीवरी के 24 घंटों के भीतर फोटोग्राफिक साक्ष्य के साथ हमारी सहायता टीम को इसकी सूचना दें।'
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
              {lang === 'en' ? 'Shipping & Delivery' : 'शिपिंग और डिलीवरी'}
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
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-orange-600" />
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
                ? 'For shipping queries, contact support@kishanseva.org'
                : 'शिपिंग संबंधी पूछताछ के लिए, support@kishanseva.org पर संपर्क करें'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
