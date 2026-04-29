'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  TrendingUp,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import FarmersTab from '@/components/admin/FarmersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import WithdrawalsTab from '@/components/admin/WithdrawalsTab';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'farmers' | 'products' | 'orders' | 'withdrawals'>('farmers');
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

  const menuItems = [
    { id: 'farmers', label: 'Farmers', icon: Users, description: 'Manage member database' },
    { id: 'products', label: 'Marketplace', icon: Package, description: 'Approve & manage listings' },
    { id: 'orders', label: 'Orders', icon: FileText, description: 'Track order fulfillment' },
    { id: 'withdrawals', label: 'Withdrawals', icon: CreditCard, description: 'Process payment requests' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div 
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
              Kishan Seva Samiti Operations Hub
            </p>
          </motion.div>

          <motion.div 
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
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Navigation */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-4 p-y-8 sticky top-32">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-3xl transition-all group relative overflow-hidden",
                      activeTab === item.id 
                        ? "bg-accent text-primary shadow-[0_0_30px_rgba(212,175,55,0.2)]" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        activeTab === item.id ? "bg-primary/20" : "bg-white/5 group-hover:bg-accent/20"
                      )}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-wider leading-none">{item.label}</p>
                        <p className={cn(
                          "text-[9px] mt-1 transition-colors",
                          activeTab === item.id ? "text-primary/60" : "text-white/30"
                        )}>{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-all",
                      activeTab === item.id ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )} />
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Live Monitoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                {activeTab === 'farmers' && <FarmersTab />}
                {activeTab === 'products' && <ProductsTab />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'withdrawals' && <WithdrawalsTab />}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
