'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dictionary } from '@/context/LanguageContext';
import { 
  BarChart3, 
  Users, 
  LogOut, 
  Wallet,
  CreditCard
} from 'lucide-react';
import SidebarNav from './SidebarNav';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  lang: string;
  dict: Dictionary;
}

export default function Sidebar({ lang, dict }: SidebarProps) {
  const { logout } = useAuth();
  
  const NAV_ITEMS = [
    { name: dict.sidebar?.overview || "Overview", href: `/${lang}/dashboard`, icon: BarChart3 },
    { name: lang === 'en' ? "Membership Card" : "सदस्यता कार्ड", href: `/${lang}/dashboard/card`, icon: CreditCard },
    { name: dict.sidebar?.wallet || "Wallet", href: `/${lang}/dashboard/wallet`, icon: Wallet },
    { name: dict.sidebar?.referrals || "Community Outreach", href: `/${lang}/dashboard/outreach`, icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Failed to logout", err);
    }
  };

  return (
    <aside className="w-80 h-screen bg-[#122c1f] text-[#fbf9f5] flex flex-col sticky top-0 overflow-hidden shrink-0 print:hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#77574d]/20 blur-[60px] -translate-y-1/2 translate-x-1/2" />
      
      {/* Logo */}
      <div className="p-10 relative z-10">
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <Image 
            src="/logo.png" 
            alt="Kishan Seva Logo" 
            width={52} 
            height={52} 
            className="w-[52px] h-[52px] object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight">{dict.sidebar?.brand || "Kishan Seva"}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">{dict.sidebar?.portal || "Farmer Portal"}</p>
          </div>
        </Link>
      </div>

      {/* Navigation (Client Component for active states/animations) */}
      <SidebarNav lang={lang} dict={dict} items={NAV_ITEMS} />

      {/* Footer */}
      <div className="p-6 border-t border-white/5 relative z-10 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-wide">{dict.sidebar?.logout || "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
