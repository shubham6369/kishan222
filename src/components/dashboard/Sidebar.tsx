import React from 'react';
import Link from 'next/link';
import { Dictionary } from '@/context/LanguageContext';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  LogOut, 
  Home,
  PlusCircle,
  Landmark,
  Wallet,
  Store,
  IdCard,
  CreditCard
} from 'lucide-react';
import SidebarNav from './SidebarNav';

interface SidebarProps {
  lang: string;
  dict: Dictionary;
}

export default function Sidebar({ lang, dict }: SidebarProps) {
  const NAV_ITEMS = [
    { name: dict.sidebar.overview, href: `/${lang}/dashboard`, icon: BarChart3 },
    { name: dict.sidebar.my_card, href: `/${lang}/dashboard/card`, icon: IdCard },
    { name: dict.sidebar.marketplace, href: `/${lang}/marketplace`, icon: Home },
    { name: dict.sidebar.seller_hub, href: `/${lang}/dashboard/seller`, icon: Store },
    { name: dict.sidebar.my_products, href: `/${lang}/dashboard/products`, icon: ShoppingBag },
    { name: dict.sidebar.referrals, href: `/${lang}/dashboard/referrals`, icon: Users },
    { name: dict.sidebar.payments, href: `/${lang}/dashboard/payments`, icon: CreditCard },
    { name: dict.sidebar.wallet, href: `/${lang}/dashboard/wallet`, icon: Wallet },
  ];

  return (
    <aside className="w-80 h-screen bg-[#122c1f] text-[#fbf9f5] flex flex-col sticky top-0 overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#77574d]/20 blur-[60px] -translate-y-1/2 translate-x-1/2" />
      
      {/* Logo */}
      <div className="p-10 relative z-10">
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight">{dict.sidebar.brand}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">{dict.sidebar.portal}</p>
          </div>
        </Link>
      </div>

      {/* Navigation (Client Component for active states/animations) */}
      <SidebarNav lang={lang} dict={dict} items={NAV_ITEMS} />

      {/* Quick Sell CTA */}
      <div className="px-6 py-10 relative z-10">
        <div className="p-8 bg-[#77574d] rounded-3xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <PlusCircle className="w-16 h-16" />
            </div>
            <h4 className="text-sm font-serif font-bold relative z-10">{dict.sidebar.surplus_title}</h4>
            <p className="text-[10px] opacity-70 relative z-10 leading-relaxed">{dict.sidebar.surplus_desc}</p>
            <Link 
                href={`/${lang}/dashboard/products/new`}
                className="block text-center py-3 bg-[#122c1f] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all relative z-10"
            >
                {dict.sidebar.sell_now}
            </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 relative z-10">
        <button className="w-full flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-colors group">
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-wide">{dict.sidebar.logout}</span>
        </button>
      </div>
    </aside>
  );
}
