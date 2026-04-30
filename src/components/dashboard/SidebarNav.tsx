'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m } from 'framer-motion';
import { Dictionary } from '@/context/LanguageContext';

interface SidebarNavProps {
  lang: string;
  dict: Dictionary;
  items: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
  }>;
}

export default function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-6 space-y-2 relative z-10 pt-4">
      {items.map((item) => {
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
              <m.div 
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
  );
}
