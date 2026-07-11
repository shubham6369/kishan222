'use client';

import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp
} from 'lucide-react';
import { m } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import FarmersTab from '@/components/admin/FarmersTab';

export default function AdminDashboard() {
  const { userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!userData || !userData.isAdmin)) {
      router.replace('/');
    }
  }, [userData, loading, router]);

  if (loading || !userData?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <m.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 text-accent mb-2">
              <ShieldCheck className="w-8 h-8" />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Master Control</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Admin <span className="text-accent italic">Portal</span>
            </h1>
            <p className="text-white/40 mt-2 font-body text-sm uppercase tracking-widest">
              Kishan Seva Operations Hub
            </p>
          </m.div>

          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px]"
          >
            <div className="p-3 bg-accent/20 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Platform Status</p>
              <p className="text-white font-bold">SYSTEM ACTIVE</p>
            </div>
          </m.div>
        </div>

        {/* Main Content Area */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 font-body">
            <FarmersTab />
          </div>
        </m.div>
      </div>
    </div>
  );
}
