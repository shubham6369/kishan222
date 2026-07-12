'use client';

import React from 'react';
import { Dictionary } from '@/context/LanguageContext';
import { m } from 'framer-motion';
import {
  Leaf, Shield, Users, Heart, MapPin,
  ChevronRight, Sprout, Sun, Droplets
} from 'lucide-react';
import Link from 'next/link';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

interface AboutContentProps {
  lang: string;
  dict: Dictionary;
}

export default function AboutContent({ lang, dict }: AboutContentProps) {
  const PILLARS = [
    {
      icon: Leaf,
      title: dict.about.pillars.organic.title,
      desc: dict.about.pillars.organic.desc,
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Shield,
      title: dict.about.pillars.protection.title,
      desc: dict.about.pillars.protection.desc,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Users,
      title: dict.about.pillars.community.title,
      desc: dict.about.pillars.community.desc,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const MILESTONES = [
    { year: '2019', event: lang === 'en' ? 'Foundation of Kishan Seva in Lucknow' : 'लखनऊ में किशन सेवा की स्थापना' },
    { year: '2021', event: lang === 'en' ? 'First 500 farmers enrolled in membership programme' : 'सदस्यता कार्यक्रम में पहले 500 किसान नामांकित' },
    { year: '2022', event: lang === 'en' ? 'Organic Marketplace launched with 50+ product categories' : '50+ उत्पाद श्रेणियों के साथ जैविक बाजार शुरू किया गया' },
    { year: '2023', event: lang === 'en' ? 'Community outreach program expanded to rural clusters' : 'सामुदायिक आउटरीच कार्यक्रम ग्रामीण समूहों तक विस्तारित किया गया' },
    { year: '2024', event: lang === 'en' ? 'Digital membership card launched for all enrolled farmers' : 'सभी नामांकित किसानों के लिए डिजिटल सदस्यता कार्ड लॉन्च किया गया' },
    { year: '2025', event: lang === 'en' ? 'Platform expanded pan-India with bilingual support' : 'द्विभाषी समर्थन के साथ पूरे भारत में मंच का विस्तार' },
  ];


  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#122c1f] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, #77574d 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4a7c59 0%, transparent 50%)',
        }} />
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-40 relative z-10">
          <m.div {...fadeUp()} className="max-w-3xl">
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold uppercase tracking-widest mb-6">
              <Sprout className="w-4 h-4" />
              {dict.about.story_tag}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              {dict.about.hero_title}
            </h1>
            <p className="text-white/70 text-xl leading-relaxed max-w-2xl">
              {dict.about.hero_subtitle}
            </p>
          </m.div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fbf9f5]" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
      </section>

      {/* Mission Statement */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <m.div {...fadeUp()} className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">
              {lang === 'en' ? 'Membership Campaign' : 'सदस्यता अभियान'}
            </p>
            
            <h2 className="text-4xl font-serif font-bold text-[#122c1f] leading-tight">
              {lang === 'en' ? 'Kishan Seva Membership Campaign' : 'किसान सेवा सदस्यता अभियान'}
            </h2>
            
            <p className="text-lg font-bold text-green-700">
              {lang === 'en' ? '🌾 Join Kishan Seva, Promote Organic Farming! 🌾' : '🌾 किसान सेवा से जुड़ें, जैविक खेती को बढ़ाएँ! 🌾'}
            </p>
            
            <div className="inline-block px-4 py-2 bg-green-50 text-green-800 font-bold rounded-xl text-sm border border-green-100 shadow-sm">
              {lang === 'en' ? 'Get your membership card for just ₹50.' : 'मात्र ₹50 में सदस्यता कार्ड बनवाएँ।'}
            </div>
            
            <ul className="space-y-3 pt-2">
              {[
                lang === 'en' ? 'Cow dung purchase and sale facility' : 'गोबर खरीद एवं बिक्री की सुविधा',
                lang === 'en' ? 'Opportunity to join organic fertilizer production' : 'जैविक खाद निर्माण से जुड़ने का अवसर',
                lang === 'en' ? 'Organic farming information and support' : 'जैविक खेती संबंधी जानकारी और सहयोग',
                lang === 'en' ? 'Information on farmer welfare schemes' : 'किसान हित की योजनाओं की जानकारी',
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[#77574d] font-semibold text-sm">
                  <span className="text-emerald-600 shrink-0 text-base leading-none">✅</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <p className="text-[#77574d] text-sm font-medium leading-relaxed pt-2">
              {lang === 'en' 
                ? 'Get your Kishan Seva Membership Card today and become a part of this campaign.' 
                : 'आज ही किसान सेवा सदस्यता कार्ड बनवाएँ और किसानों के इस अभियान का हिस्सा बनें।'}
            </p>

            <div className="border-l-4 border-green-600 pl-4 py-2 bg-[#fbf9f5] rounded-r-2xl border border-black/5 p-4 shadow-sm text-xs font-semibold text-[#77574d] leading-relaxed italic">
              {lang === 'en'
                ? '"A membership card for just ₹50 – an easy way to join the Kishan Seva family." 🌱🚜🌾'
                : '"मात्र ₹50 का सदस्यता कार्ड – किसान सेवा परिवार से जुड़ने का आसान माध्यम।" 🌱🚜🌾'}
            </div>

            <div className="pt-4">
              <Link
                href={`/${lang}/register`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#122c1f] text-white rounded-2xl font-bold hover:bg-[#122c1f]/90 transition-all hover:scale-105 shadow-md"
              >
                {lang === 'en' ? 'Join the Campaign' : 'अभियान से जुड़ें'} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </m.div>

          <m.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-4">
            {[
              { icon: Sun, label: dict.about.stats.active, value: '5+' },
              { icon: Users, label: dict.about.stats.farmers, value: '5,000+' },
              { icon: Leaf, label: dict.about.stats.products, value: '200+' },
              { icon: MapPin, label: dict.about.stats.districts, value: '50+' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm text-center">
                <stat.icon className="w-6 h-6 text-[#77574d] mx-auto mb-3" />
                <p className="text-3xl font-serif font-bold text-[#122c1f]">{stat.value}</p>
                <p className="text-xs text-[#77574d] mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </m.div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <m.div {...fadeUp()} className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d] mb-3">{dict.about.pillars_title}</p>
            <h2 className="text-4xl font-serif font-bold text-[#122c1f]">{dict.about.pillars_subtitle}</h2>
          </m.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, i) => (
              <m.div key={i} {...fadeUp(i * 0.1)}
                className="p-8 rounded-3xl border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1 bg-white"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pillar.color} mb-5`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#122c1f] mb-3">{pillar.title}</h3>
                <p className="text-sm text-[#77574d] leading-relaxed">{pillar.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <m.div {...fadeUp()} className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d] mb-3">{dict.about.milestones_title}</p>
          <h2 className="text-4xl font-serif font-bold text-[#122c1f]">{dict.about.milestones_subtitle}</h2>
        </m.div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#122c1f]/10 hidden md:block" />
          <div className="space-y-8">
            {MILESTONES.map((milestone, i) => (
              <m.div key={i} {...fadeUp(i * 0.08)}
                className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white rounded-3xl px-8 py-6 border border-black/5 shadow-sm inline-block">
                    <p className="text-xs font-bold text-[#77574d] uppercase tracking-widest mb-1">{milestone.year}</p>
                    <p className="font-bold text-[#122c1f]">{milestone.event}</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#122c1f] border-4 border-[#fbf9f5] shrink-0 hidden md:block" />
                <div className="flex-1" />
              </m.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <m.div {...fadeUp()}>
          <Droplets className="w-10 h-10 text-[#77574d] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#122c1f] mb-4">
            {dict.about.cta_title}
          </h2>
          <p className="text-[#77574d] text-lg mb-8 max-w-2xl mx-auto">
            {dict.about.cta_desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${lang}/register`}
              className="px-10 py-5 bg-[#122c1f] text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              {dict.about.cta_get_card}
            </Link>
            <Link href={`/${lang}/contact`}
              className="px-10 py-5 bg-white border border-black/10 text-[#122c1f] rounded-2xl font-bold hover:shadow-md transition-all"
            >
              {dict.about.cta_contact}
            </Link>
          </div>
        </m.div>
      </section>
    </>
  );
}

