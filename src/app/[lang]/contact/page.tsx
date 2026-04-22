'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle,
  ChevronRight, HelpCircle, Share2
} from 'lucide-react';
import { useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const FAQS = [
  {
    q: 'How do I get my farmer membership card?',
    a: 'Register on our platform, complete your farming profile, and pay the one-time ₹50 membership fee. Your digital card is generated instantly.',
  },
  {
    q: 'When is the referral reward credited?',
    a: 'The ₹7 reward is credited to your wallet only after the referred farmer successfully pays the ₹50 membership fee — not before.',
  },
  {
    q: 'What is the minimum balance to request a withdrawal?',
    a: 'You need a minimum wallet balance of ₹100 to submit a withdrawal request. Admin processes all requests within 24 hours.',
  },
  {
    q: 'How do I start selling my organic products?',
    a: 'After completing membership, go to your Dashboard → My Products → Add New Product. Your listing goes live immediately after review.',
  },
  {
    q: 'Is my UPI information safe?',
    a: 'Yes. Your UPI ID is only visible to our admin team for processing your approved withdrawal. It is never shared publicly.',
  },
];

export default function ContactPage() {
  const params = useParams();
  const [form, setForm] = React.useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill name, phone, and message.');
      return;
    }
    setSending(true);
    // Simulate sending (replace with real API / WhatsApp API / email in production)
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We will respond within 24 hours.');
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
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Contact Us</h1>
            <p className="text-white/60 text-xl max-w-xl">
              Have a question, need support, or want to partner with us? Our team is here to help.
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
              <h2 className="text-2xl font-serif font-bold text-[#122c1f] mb-6">Reach Us Directly</h2>

              {[
                { icon: Phone, label: 'Helpline', value: '+91 98290 XXXXX', sub: 'Mon–Sat, 9am–6pm', href: 'tel:+919829000000' },
                { icon: MessageCircle, label: 'WhatsApp', value: '+91 98290 XXXXX', sub: 'Quick replies', href: 'https://wa.me/919829000000' },
                { icon: Mail, label: 'Email', value: 'help@kishanseva.in', sub: 'We reply within 24h', href: 'mailto:help@kishanseva.in' },
                { icon: MapPin, label: 'Head Office', value: 'Jaipur, Rajasthan', sub: 'India — 302001', href: '#' },
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-4 bg-white rounded-2xl px-6 py-5 border border-black/5 shadow-sm hover:shadow-md transition-all group mb-3 last:mb-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#122c1f]/5 flex items-center justify-center shrink-0 group-hover:bg-[#122c1f] group-hover:text-white transition-colors">
                    <item.icon className="w-5 h-5 text-[#122c1f] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{item.label}</p>
                    <p className="font-bold text-[#122c1f] mt-0.5">{item.value}</p>
                    <p className="text-xs text-[#77574d] opacity-70">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#77574d]/30 ml-auto self-center group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </motion.div>

            {/* Social */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d] mb-4">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: 'Facebook', href: '#' },
                  { label: 'Instagram', href: '#' },
                  { label: 'WhatsApp', href: 'https://wa.me/919829000000' },
                ].map((s, i) => (
                  <a key={i} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-[#77574d] hover:bg-[#122c1f] hover:text-white hover:border-[#122c1f] transition-all text-xs font-bold"
                  >
                    {s.label.charAt(0)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-black/5 shadow-sm p-10 space-y-6">
              <h2 className="text-2xl font-serif font-bold text-[#122c1f]">Send Us a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ramesh Kumar"
                    className="w-full px-5 py-4 bg-[#fbf9f5] rounded-2xl text-[#122c1f] focus:ring-2 focus:ring-[#122c1f]/10 border-none outline-none placeholder:text-[#77574d]/30"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Mobile Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-5 py-4 bg-[#fbf9f5] rounded-2xl text-[#122c1f] focus:ring-2 focus:ring-[#122c1f]/10 border-none outline-none placeholder:text-[#77574d]/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Email (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full px-5 py-4 bg-[#fbf9f5] rounded-2xl text-[#122c1f] focus:ring-2 focus:ring-[#122c1f]/10 border-none outline-none placeholder:text-[#77574d]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="w-full px-5 py-4 bg-[#fbf9f5] rounded-2xl text-[#122c1f] focus:ring-2 focus:ring-[#122c1f]/10 border-none outline-none resize-none placeholder:text-[#77574d]/30"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-5 bg-[#122c1f] text-white rounded-2xl font-bold uppercase tracking-wider hover:bg-[#122c1f]/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>

              <p className="text-xs text-center text-[#77574d]/60">
                <Clock className="w-3 h-3 inline mr-1" />
                We typically respond within 24 hours during business days.
              </p>
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <HelpCircle className="w-8 h-8 text-[#77574d] mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-[#122c1f]">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-5 text-left"
                >
                  <span className="font-bold text-[#122c1f] pr-4">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-[#77574d] shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-7 pb-5 text-[#77574d] text-sm leading-relaxed border-t border-black/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
