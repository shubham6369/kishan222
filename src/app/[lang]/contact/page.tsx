'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle,
  ChevronRight, HelpCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { dict, lang } = useLanguage();

  const CONTACT_METHODS = [
    {
      icon: Phone,
      title: dict.contact.phone,
      value: '+91 91168 11111',
      desc: dict.footer.support_hours,
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Mail,
      title: dict.contact.email,
      value: 'support@kishanseva.org',
      desc: dict.footer.digital_support,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: MapPin,
      title: dict.contact.visit,
      value: 'Vidhyadhar Nagar, Jaipur',
      desc: dict.contact.visit_address,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  const FAQS = [
    {
      q: lang === 'en' ? 'How do I generate my membership card?' : 'मैं अपना सदस्यता कार्ड कैसे बनाऊं?',
      a: lang === 'en' ? 'Register on our platform and pay the one-time fee of ₹50 to generate your digital card instantly.' : 'हमारे प्लेटफॉर्म पर पंजीकरण करें और तुरंत अपना डिजिटल कार्ड बनाने के लिए ₹50 का एक बार शुल्क दें।',
    },
    {
      q: lang === 'en' ? 'When will I receive my referral commission?' : 'मुझे मेरा रेफरल कमीशन कब मिलेगा?',
      a: lang === 'en' ? 'Commission is credited instantly to your wallet once your referred farmer successfully generates their card.' : 'एक बार जब आपका रेफ़र किया गया किसान सफलतापूर्वक अपना कार्ड बना लेता है, तो कमीशन आपके वॉलेट में तुरंत जमा कर दिया जाता है।',
    },
    {
      q: lang === 'en' ? 'Can I sell my products directly here?' : 'क्या मैं अपने उत्पाद सीधे यहाँ बेच सकता हूँ?',
      a: lang === 'en' ? 'Yes, verified members can list their organic products in our marketplace for direct consumer purchase.' : 'हाँ, सत्यापित सदस्य सीधे उपभोक्ता खरीद के लिए हमारे बाज़ार में अपने जैविक उत्पादों को सूचीबद्ध कर सकते हैं।',
    },
  ];
  const [form, setForm] = React.useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error(lang === 'en' ? 'Please fill name, phone, and message.' : 'कृपया नाम, फोन और संदेश भरें।');
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success(lang === 'en' ? 'Message sent! We will respond within 24 hours.' : 'संदेश भेजा गया! हम 24 घंटों के भीतर जवाब देंगे।');
    setForm({ name: '', phone: '', email: '', message: '' });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      <Toaster position="top-center" />

      {/* Hero */}
      <section className="bg-[#122c1f] text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 70% 50%, #77574d 0%, transparent 60%)',
        }} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-4">Get In Touch</p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              {dict.contact.title}
            </h1>
            <p className="text-white/70 text-xl leading-relaxed max-w-2xl">
              {dict.contact.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-serif font-bold text-[#122c1f] mb-6">{lang === 'en' ? 'Reach Us Directly' : 'हमसे सीधे संपर्क करें'}</h2>

              {CONTACT_METHODS.map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-2xl px-6 py-5 border border-black/5 shadow-sm mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{item.title}</p>
                    <p className="font-bold text-[#122c1f] mt-0.5">{item.value}</p>
                    <p className="text-xs text-[#77574d] opacity-70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-3xl font-serif font-bold text-[#122c1f] mb-8">{dict.contact.reach_out}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#122c1f] uppercase tracking-wider">{dict.contact.form_name}</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#fbf9f5] border border-black/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#122c1f]/10 outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#122c1f] uppercase tracking-wider">{dict.contact.form_email}</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-[#fbf9f5] border border-black/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#122c1f]/10 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#122c1f] uppercase tracking-wider">{dict.contact.form_subject}</label>
                <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-[#fbf9f5] border border-black/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#122c1f]/10 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#122c1f] uppercase tracking-wider">{dict.contact.form_message}</label>
                <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full bg-[#fbf9f5] border border-black/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#122c1f]/10 outline-none transition-all resize-none" required></textarea>
              </div>
              <button disabled={sending} className="w-full py-5 bg-[#122c1f] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#122c1f]/90 transition-all hover:scale-[1.01]">
                <Send className="w-4 h-4" />
                {sending ? (lang === 'en' ? 'Sending...' : 'भेज रहा है...') : dict.contact.form_submit}
              </button>
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <HelpCircle className="w-8 h-8 text-[#77574d] mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-[#122c1f]">{dict.contact.faqs_title}</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#fbf9f5] rounded-[32px] p-8 border border-black/5"
              >
                <h3 className="text-lg font-bold text-[#122c1f] mb-3 flex items-start gap-3">
                  <span className="text-[#77574d]/40 font-serif">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-[#77574d] leading-relaxed pl-8">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
