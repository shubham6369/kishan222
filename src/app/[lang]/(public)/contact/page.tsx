'use client';

import React from 'react';
import { m } from 'framer-motion';
import {
  Phone, Mail, MapPin, Send
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { dict, lang } = useLanguage();

  const CONTACT_METHODS = [
    {
      icon: Phone,
      title: dict.contact.phone,
      value: '+91 91200 77139',
      desc: dict.footer.support_hours,
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Mail,
      title: dict.contact.email,
      value: 'sandeepkumarchauhan805@gmail.com',
      desc: dict.footer.digital_support,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: MapPin,
      title: dict.contact.visit,
      value: 'Ayodhya Road, Lucknow',
      desc: dict.contact.visit_address,
      color: 'bg-orange-50 text-orange-600',
    },
  ];


  const [form, setForm] = React.useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = React.useState(false);

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
          <m.div
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
          </m.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <m.div
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
            </m.div>
          </div>

          {/* Right: Contact Form */}
          <m.div
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
          </m.div>
        </div>


      </div>
    </div>
  );
}
