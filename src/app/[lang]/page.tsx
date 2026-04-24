"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CreditCard, Users, Star, ShoppingBag, Leaf, Trophy, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { lang, dict } = useLanguage();
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section - Cinematic & Premium */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <Image 
            src="/hero-sustainable.png" 
            alt="Sustainable Agriculture Hero" 
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Darker gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent z-1"></div>
          <div className="absolute inset-0 bg-linear-to-b from-primary/20 to-transparent z-1"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-panel px-6 py-2 rounded-full text-accent font-body text-xs font-bold tracking-[0.2em] uppercase"
            >
              <Star className="w-4 h-4 fill-accent" />
              The Gold Standard of Rural Heritage
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl font-serif leading-none text-white! drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {dict.hero?.title || 'Cultivating the Legacy of Tomorrow'}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90! font-body leading-relaxed max-w-xl drop-shadow-md">
              {dict.hero?.subtitle || "Join India's most prestigious agricultural collective. We bridge the gap between ancient wisdom and modern innovation, empowering farmers through sustainable membership and premium organic commerce."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href={`/${lang}/register`} className="btn-premium group shadow-2xl shadow-accent/10">
                {dict.hero?.cta_join || 'Join the Samiti'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={`/${lang}/marketplace`} className="px-8 py-4 rounded-full font-bold border border-white/20 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                {dict.hero?.cta_marketplace || 'Explore the Harvest'}
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            <div className="glass-panel p-8 rounded-3xl space-y-8 max-w-md ml-auto">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                  <Leaf className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white text-xl">100% Regenerative</h3>
                  <p className="text-white/60 text-sm">Beyond Organic Standards</p>
                </div>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Trophy className="text-accent w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white text-xl">Heritage Certified</h3>
                  <p className="text-white/60 text-sm">Empowering Local Lineage</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <motion.section 
        {...fadeInUp}
        className="py-12 bg-white border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 font-serif text-2xl font-bold">TRUSTED BY OVER 50,000+ FARMERS</div>
             <div className="flex items-center gap-2 font-serif text-2xl font-bold italic">ISO 22000 CERTIFIED</div>
             <div className="flex items-center gap-2 font-serif text-2xl font-bold">ORGANIC INDIA PARTNER</div>
             <div className="flex items-center gap-2 font-serif text-2xl font-bold italic text-gold-500">HERITAGE PRESERVATION AWARD 2024</div>
          </div>
        </div>
      </motion.section>

      {/* Services Section - Redefined with Glassmorphism */}
      <section className="section-padding bg-[#f8faf9] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        
        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <motion.div 
            {...fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-6xl">Elevating the Farming Experience</h2>
            <p className="text-primary/60 font-body text-xl leading-relaxed">
              Our suite of services is designed for the modern steward who values both tradition and technological excellence.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: dict.features?.cards?.card?.title || "Premium Membership",
                desc: dict.features?.cards?.card?.desc || "Carry your heritage digitally. Our exclusive cards unlock a world of government subsidies, technical workshops, and global export access.",
                link: `/${lang}/dashboard`,
                color: "bg-primary"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: dict.features?.cards?.referral?.title || "Collective Prosperity",
                desc: dict.features?.cards?.referral?.desc || "Drive community wealth through our unique referral ecosystem. Share your success with neighboring farms and earn collective incentives.",
                link: `/${lang}/dashboard/referrals`,
                color: "bg-accent"
              },
              {
                icon: <ShoppingBag className="w-8 h-8" />,
                title: dict.features?.cards?.market?.title || "Direct-to-Global",
                desc: dict.features?.cards?.market?.desc || "List your premium organic harvest on our world-class marketplace. Skip the intermediaries and command the true value of your labor.",
                link: `/${lang}/marketplace`,
                color: "bg-emerald-700"
              }
            ].map((service, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="glass-card p-12 rounded-[40px] group hover:-translate-y-4 transition-all duration-500 flex flex-col justify-between h-full"
              >
                <div>
                  <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center mb-10 text-white shadow-xl group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <h3 className="text-3xl mb-6">{service.title}</h3>
                  <p className="text-primary/70 font-body text-lg leading-relaxed mb-10">
                    {service.desc}
                  </p>
                </div>
                <Link href={service.link} className="inline-flex items-center gap-3 font-bold text-primary group-hover:text-accent-dark transition-colors text-lg">
                  Explore Service <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW: Sustainability Impact Section */}
      <section className="section-padding bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-white text-4xl md:text-6xl">Rooted in Earth, <br />Dedicated to <span className="text-accent underline decoration-accent/30 underline-offset-8">Future</span></h2>
            <p className="text-white/70 font-body text-xl leading-relaxed">
              Kishan Seva Samiti isn't just a platform; it's a movement towards regenerative agriculture. We monitor over 1 million hectares of soil health, ensuring that every harvest contributes back to the planet.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { label: "Reduction in Chemical Usage", value: "98.4%" },
                { label: "Generated for Rural Families", value: "₹4,200Cr" },
                { label: "Trees Planted via Revenue Share", value: "1.2M+" },
                { label: "Supply Chain Target 2026", value: "0-Carbon" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <div className="text-4xl font-serif text-accent tracking-tighter">{stat.value}</div>
                  <div className="text-white/60 font-body uppercase tracking-widest text-xs font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="aspect-square rounded-[60px] overflow-hidden border-12 border-white/5 relative shadow-2xl">
                <div className="absolute inset-0 bg-accent/20 z-10 mix-blend-overlay"></div>
                <Image 
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1200&auto=format&fit=crop" 
                  alt="Sustainable Farmer" 
                  fill 
                  className="object-cover scale-110 hover:scale-100 transition-transform duration-1000"
                />
             </div>
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 -right-10 glass-panel p-10 rounded-3xl hidden md:block"
             >
                <Globe className="w-12 h-12 text-accent mb-4" />
                <div className="text-white font-bold">Global Impact</div>
                <div className="text-white/60 text-sm">Verified ESG Platform</div>
             </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Final Call to Action - Ultra Premium */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-6 translate-y-32"></div>
        <motion.div 
          {...fadeInUp}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-12"
        >
          <h2 className="text-5xl md:text-8xl leading-tight text-primary">Your Heritage <br /> Deserves a <span className="italic text-accent-dark">Signature</span></h2>
          <p className="text-primary/60 font-body text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            The committee currently has 49,820 active stewards. We only open 180 new membership slots each month to maintain quality of service and heritage preservation standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
             <Link href={`/${lang}/register`} className="btn-premium px-16 py-6 text-xl shadow-2xl shadow-accent/20">
               {dict.hero?.cta_join || 'Apply for Membership'}
             </Link>
             <Link href={`/${lang}/contact`} className="px-16 py-6 rounded-full font-bold text-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
               Speak to a Council Member
             </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

