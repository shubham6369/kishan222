'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  IdCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'My Card', href: '/dashboard/card', icon: IdCard },
  { name: 'Marketplace', href: '/marketplace', icon: Home },
  { name: 'Seller Hub', href: '/dashboard/seller', icon: Store },
  { name: 'My Products', href: '/dashboard/products', icon: ShoppingBag },
  { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-80 h-screen bg-[#122c1f] text-[#fbf9f5] flex flex-col sticky top-0 overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#77574d]/20 blur-[60px] -translate-y-1/2 translate-x-1/2" />
      
      {/* Logo */}
      <div className="p-10 relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight">Kishan Seva</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Samiti Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2 relative z-10 pt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-[#77574d] rounded-r-full"
                />
              )}
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#77574d]' : ''}`} />
              <span className="text-sm font-bold tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Sell CTA */}
      <div className="px-6 py-10 relative z-10">
        <div className="p-8 bg-[#77574d] rounded-3xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <PlusCircle className="w-16 h-16" />
            </div>
            <h4 className="text-sm font-serif font-bold relative z-10">Have Surplus?</h4>
            <p className="text-[10px] opacity-70 relative z-10 leading-relaxed">List your organic produce and reach thousands of buyers.</p>
            <Link 
                href="/dashboard/products/new"
                className="block text-center py-3 bg-[#122c1f] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all relative z-10"
            >
                Sell Now
            </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 relative z-10">
        <button className="w-full flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-colors group">
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}
