'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, Shield, Users, Heart, Award, MapPin,
  Phone, Mail, Globe, ChevronRight, Sprout, Sun, Droplets
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const PILLARS = [
  {
    icon: Leaf,
    title: 'Organic Farming',
    desc: 'Promoting sustainable, chemical-free agricultural practices rooted in ancient Indian wisdom and modern science.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Shield,
    title: 'Farmer Protection',
    desc: 'Verified membership cards that protect farmers from exploitation and establish their identity in the market.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'Building a powerful network where every farmer supports each other through referrals, knowledge sharing, and solidarity.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Heart,
    title: 'Gaushala Integration',
    desc: 'Deeply rooted in our love for cows — connecting farmers with authentic panchgavya products for holistic farming.',
    color: 'bg-orange-50 text-orange-600',
  },
];

const MILESTONES = [
  { year: '2020', event: 'Foundation of Kishan Seva Samiti in Rajasthan' },
  { year: '2021', event: 'First 500 farmers enrolled in membership programme' },
  { year: '2022', event: 'Organic Marketplace launched with 50+ product categories' },
  { year: '2023', event: 'Referral system introduced — ₹7 per verified farmer' },
  { year: '2024', event: 'Digital membership card launched for all enrolled farmers' },
  { year: '2025', event: 'Platform expanded pan-India with bilingual support' },
];

const TEAM = [
  { name: 'Shri Ramkishan Sharma', role: 'Founder & President', location: 'Jaipur, Rajasthan' },
  { name: 'Smt. Kamla Devi', role: 'Secretary General', location: 'Ajmer, Rajasthan' },
  { name: 'Dr. Vijay Gupta', role: 'Chief Agricultural Advisor', location: 'Kota, Rajasthan' },
];

export default function AboutPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      {/* Hero */}
      <section className="relative bg-[#122c1f] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, #77574d 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4a7c59 0%, transparent 50%)',
        }} />
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-40 relative z-10">
          <motion.div {...fadeUp()} className="max-w-3xl">
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold uppercase tracking-widest mb-6">
              <Sprout className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              Rooted in the<br />
              <span className="text-green-400 italic">Soil of India</span>
            </h1>
            <p className="text-white/70 text-xl leading-relaxed max-w-2xl">
              Kishan Seva Samiti was born from a simple belief — that every Indian farmer deserves dignity, 
              a fair market, and a community that stands behind them.
            </p>
          </motion.div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fbf9f5]" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
      </section>

      {/* Mission Statement */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d] mb-4">Our Mission</p>
            <h2 className="text-4xl font-serif font-bold text-[#122c1f] leading-tight mb-6">
              Empowering Farmers with Identity, Income & Independence
            </h2>
            <p className="text-[#77574d] text-lg leading-relaxed mb-4">
              We provide every registered farmer with an official membership card, a direct marketplace 
              to sell organic produce, and a referral-based income system — all in one unified platform.
            </p>
            <p className="text-[#77574d] leading-relaxed">
              Our platform bridges the gap between rural farmers and urban consumers, eliminating middlemen 
              and ensuring fair prices for quality organic products.
            </p>
            <Link
              href={`/${lang}/register`}
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#122c1f] text-white rounded-2xl font-bold hover:bg-[#122c1f]/90 transition-all hover:scale-105"
            >
              Join the Movement <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-4">
            {[
              { icon: Sun, label: 'Years Active', value: '5+' },
              { icon: Users, label: 'Registered Farmers', value: '5,000+' },
              { icon: Leaf, label: 'Organic Products', value: '200+' },
              { icon: MapPin, label: 'Districts Covered', value: '50+' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm text-center">
                <stat.icon className="w-6 h-6 text-[#77574d] mx-auto mb-3" />
                <p className="text-3xl font-serif font-bold text-[#122c1f]">{stat.value}</p>
                <p className="text-xs text-[#77574d] mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d] mb-3">What We Stand For</p>
            <h2 className="text-4xl font-serif font-bold text-[#122c1f]">Our Four Pillars</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="p-8 rounded-3xl border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1 bg-white"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pillar.color} mb-5`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#122c1f] mb-3">{pillar.title}</h3>
                <p className="text-sm text-[#77574d] leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d] mb-3">Our Journey</p>
          <h2 className="text-4xl font-serif font-bold text-[#122c1f]">Milestones</h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#122c1f]/10 hidden md:block" />
          <div className="space-y-8">
            {MILESTONES.map((m, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white rounded-3xl px-8 py-6 border border-black/5 shadow-sm inline-block">
                    <p className="text-xs font-bold text-[#77574d] uppercase tracking-widest mb-1">{m.year}</p>
                    <p className="font-bold text-[#122c1f]">{m.event}</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#122c1f] border-4 border-[#fbf9f5] shrink-0 hidden md:block" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-[#122c1f] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Leadership</p>
            <h2 className="text-4xl font-serif font-bold text-white">Our Team</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-serif font-bold text-white mx-auto mb-5">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-white text-lg">{member.name}</h3>
                <p className="text-green-400 text-sm mt-1 font-medium">{member.role}</p>
                <p className="text-white/40 text-xs mt-2 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" /> {member.location}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div {...fadeUp()}>
          <Droplets className="w-10 h-10 text-[#77574d] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#122c1f] mb-4">
            Be Part of the Change
          </h2>
          <p className="text-[#77574d] text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers across India who are building a better future through community, 
            organic farming, and mutual support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${lang}/register`}
              className="px-10 py-5 bg-[#122c1f] text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              Get Your Membership Card
            </Link>
            <Link href={`/${lang}/contact`}
              className="px-10 py-5 bg-white border border-black/10 text-[#122c1f] rounded-2xl font-bold hover:shadow-md transition-all"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
