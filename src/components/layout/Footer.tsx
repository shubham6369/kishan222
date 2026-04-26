"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ArrowUpRight, Globe, Users, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { lang, dict } = useLanguage();
  return (
    <footer className="bg-primary text-white pt-32 pb-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mb-64 -mr-64"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 pb-20 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-10">
            <Link href={`/${lang}`} className="flex items-center gap-4 group">
              <div className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl">
                <Image 
                  src="/logo.png" 
                  alt="Kishan Seva Samiti Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold tracking-tight">
                  Kishan Seva <span className="text-accent italic">Samiti</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">
                  {dict.footer?.established || "Est. Rural Empowerment 2024"}
                </span>
              </div>
            </Link>
            
            <p className="text-white/60 font-body text-lg leading-relaxed max-w-md">
              {dict.footer?.mission || "The premier collective for the modern Indian farmer. We facilitate a global transition to regenerative agriculture while preserving our rich rural heritage."}
            </p>
            
            <div className="flex gap-6">
              {[Globe, Users, ShieldCheck].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            {/* Exploration */}
            <div>
              <h4 className="font-serif text-xl font-bold mb-8 text-accent">{dict.footer?.exploration || "Exploration"}</h4>
              <ul className="space-y-6 font-body text-white/50">
                {(dict.footer?.exploration_links || ["Our Heritage", "Marketplace", "Membership", "Technical Support"]).map((item: string, i: number) => (
                  <li key={i}>
                    <Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                      {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intelligence */}
            <div>
              <h4 className="font-serif text-xl font-bold mb-8 text-accent">{dict.footer?.intelligence || "Intelligence"}</h4>
              <ul className="space-y-6 font-body text-white/50">
                {(dict.footer?.intelligence_links || ["Soil Analytics", "Market Trends", "Govt Schemes", "Climate Tech"]).map((item: string, i: number) => (
                  <li key={i}>
                    <Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                      {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assistance */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-serif text-xl font-bold mb-8 text-accent">{dict.footer?.assistance || "Assistance"}</h4>
              <div className="space-y-8 font-body text-white/50">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-accent/50 shrink-0" />
                  <div className="space-y-1">
                    <span className="block text-white font-bold">1800-KISHAN</span>
                    <span className="text-xs">{dict.footer?.support_hours || "Mon - Sat, 9am - 6pm"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-accent/50 shrink-0" />
                  <div className="space-y-1">
                    <span className="block text-white font-bold">contact@kishan.org</span>
                    <span className="text-xs">{dict.footer?.digital_support || "24/7 Digital Support"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase text-white/30">
          <div className="flex gap-10">
            <Link href={`/${lang}/privacy`} className="hover:text-accent transition-colors">{dict.footer?.privacy || "Privacy Charter"}</Link>
            <Link href={`/${lang}/terms`} className="hover:text-accent transition-colors">{dict.footer?.terms || "Membership Terms"}</Link>
            <Link href={`/${lang}/ethics`} className="hover:text-accent transition-colors">{dict.footer?.ethics || "Ethics & Transparency"}</Link>
          </div>
          <p>{dict.footer?.legal || `© ${new Date().getFullYear()} Kishan Seva Samiti. A Signature Rural Initiative.`}</p>
        </div>
      </div>
    </footer>
  );
}

