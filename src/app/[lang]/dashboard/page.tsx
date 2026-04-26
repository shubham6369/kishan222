'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  ChevronRight, 
  ArrowUpRight,
  Gift,
  Search,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import MembershipCard from '@/components/MembershipCard';
import { Referral } from '@/types';


import { useLanguage } from '@/context/LanguageContext';

export default function DashboardOverview() {
  const { user, userData, loading: authLoading } = useAuth();
  const { dict, lang } = useLanguage();
  const [referrals, setReferrals] = React.useState<Referral[]>([]);
  const [loadingReferrals, setLoadingReferrals] = React.useState(true);

  React.useEffect(() => {
    async function fetchReferrals() {
      if (!user?.uid) {
          setLoadingReferrals(false);
          return;
      }
      try {
        const refQuery = query(
          collection(db, 'users', user.uid, 'referrals'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(refQuery);
        const recs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Referral[];
        setReferrals(recs);
      } catch (err) {
        console.error("Error fetching referrals:", err);
      } finally {
        setLoadingReferrals(false);
      }
    }
    fetchReferrals();
  }, [user]);
  
  const stats = [
    { 
      name: dict.dashboard.stats.earnings, 
      value: `₹${userData?.stats?.earnings || 0}`, 
      change: `+₹0 ${dict.dashboard.stats.today}`, 
      icon: Gift, 
      color: 'bg-orange-100 text-orange-600' 
    },
    { 
      name: dict.dashboard.stats.referrals, 
      value: userData?.stats?.totalReferrals || 0, 
      change: dict.dashboard.stats.lifetime, 
      icon: Users, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      name: dict.dashboard.stats.listings, 
      value: userData?.stats?.activeListings || 0, 
      change: dict.dashboard.stats.live_now, 
      icon: ShoppingBag, 
      color: 'bg-green-100 text-green-600' 
    },
  ];

  if (authLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-[#122c1f]/10 border-t-[#122c1f] rounded-full"
            />
        </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#122c1f]">{dict.dashboard.jai_kisan}, <span className="text-[#77574d]">{userData?.fullName?.split(' ')[0] || dict.dashboard.farmer}</span>!</h1>
          <p className="text-[#77574d] mt-1 font-medium">{dict.dashboard.welcome}</p>
        </div>
        
        <div className="flex gap-4">
            <button className="p-4 bg-white rounded-2xl shadow-sm border border-black/5 hover:bg-[#fbf9f5] transition-colors relative">
                <Bell className="w-5 h-5 text-[#122c1f]" />
                <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-black/5">
                <div className="w-8 h-8 rounded-full bg-[#122c1f] flex items-center justify-center text-white text-xs font-bold">
                    {userData?.fullName?.[0] || 'U'}
                </div>
                <div>
                    <p className="text-xs font-bold text-[#122c1f]">{userData?.fullName || 'User'}</p>
                    <p className="text-[10px] text-[#77574d]">{dict.dashboard.premium_member}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-[32px] border border-black/5 shadow-sm space-y-6 group hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#77574d] mb-1">{stat.name}</p>
              <h3 className="text-3xl font-serif font-bold text-[#122c1f]">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Identity & Referral */}
        <div className="lg:col-span-2 space-y-12">
            
            {/* Identity Card Section */}
            <div className="p-10 bg-[#122c1f] rounded-[40px] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#77574d]/20 blur-[80px]" />
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <h3 className="text-3xl font-serif font-bold italic">{dict.dashboard.identity.title}</h3>
                        <p className="opacity-70 text-sm leading-relaxed">
                            {dict.dashboard.identity.desc}
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => window.print()} className="px-6 py-3 bg-white text-[#122c1f] rounded-xl text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all print:hidden">
                                {dict.dashboard.identity.download}
                            </button>
                            <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all print:hidden">
                                {dict.dashboard.identity.share}
                            </button>
                        </div>
                    </div>
                    <div className="w-full max-w-sm transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                        <MembershipCard 
                            memberData={{
                                fullName: userData?.fullName || 'User',
                                membershipId: userData?.membershipId || 'KSS-PENDING',
                                location: `${userData?.village || '...'}, ${userData?.state || '...'}`,
                                phone: userData?.phone || '...',
                                crops: userData?.crops || '...',
                                landSize: userData?.landSize || '...',
                                registrationDate: userData?.registrationDate ? new Date(userData.registrationDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '...',
                                expiryDate: userData?.registrationDate ? new Date(new Date(userData.registrationDate).setFullYear(new Date(userData.registrationDate).getFullYear() + 1)).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '...',
                                memberType: dict.dashboard.farmer
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Referrals */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.dashboard.referrals.title}</h3>
                        <p className="text-sm text-[#77574d]">{dict.dashboard.referrals.subtitle}</p>
                    </div>
                    <Link href={`/${lang}/dashboard/referrals`} className="text-xs font-bold uppercase tracking-widest text-[#122c1f] flex items-center gap-2 group">
                        {dict.dashboard.referrals.view_all} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="bg-white rounded-[32px] border border-black/5 overflow-hidden shadow-sm">
                    {loadingReferrals ? (
                        <div className="p-12 text-center text-[#77574d] italic text-sm">{dict.dashboard.referrals.loading}</div>
                    ) : referrals.length > 0 ? (
                        <div className="divide-y divide-black/5">
                            {referrals.map((referral) => (
                                <div key={referral.id} className="p-6 flex justify-between items-center hover:bg-[#fbf9f5] transition-colors">
                                    <div>
                                        <p className="font-bold text-[#122c1f]">{referral.referredUserName || dict.dashboard.referrals.unknown}</p>
                                        <p className="text-xs text-[#77574d]">{dict.dashboard.referrals.joined} {referral.createdAt ? new Date(referral.createdAt.seconds * 1000).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN') : dict.dashboard.referrals.recently}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">+₹{referral.rewardAmount}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-[#77574d]">{dict.dashboard.referrals.earned}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-[#77574d] italic text-sm">
                            {dict.dashboard.referrals.none}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar / Actions */}
        <div className="space-y-8">
            {/* Wallet Section */}
            <div className="p-8 bg-white rounded-[32px] border border-black/5 space-y-6 shadow-sm">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-serif font-bold text-[#122c1f]">{dict.dashboard.wallet.title}</h4>
                    <span className="p-2 bg-[#fbf9f5] rounded-xl"><Gift className="w-5 h-5 text-[#77574d]" /></span>
                </div>
                <div>
                    <p className="text-sm text-[#77574d] mb-1">{dict.dashboard.wallet.balance}</p>
                    <h3 className="text-4xl font-serif font-bold text-[#122c1f]">₹{userData?.walletBalance || 0}</h3>
                </div>
                <button 
                  onClick={() => alert(dict.dashboard.wallet.withdraw_msg)}
                  disabled={(userData?.walletBalance || 0) < 50}
                  className="w-full py-4 bg-[#122c1f] text-white rounded-2xl font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#122c1f]/90 transition"
                >
                    {dict.dashboard.wallet.withdraw} ({dict.dashboard.wallet.min_fee})
                </button>
            </div>

            {/* Referral Link Box */}
            <div className="p-8 bg-[#77574d]/5 rounded-[32px] border border-[#77574d]/10 space-y-6">
                <div className="w-12 h-12 bg-[#77574d] rounded-2xl flex items-center justify-center shadow-lg shadow-[#77574d]/20">
                    <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-serif font-bold text-[#122c1f]">{dict.dashboard.referral_box.title}</h4>
                    <p className="text-sm text-[#77574d] italic">{dict.dashboard.referral_box.subtitle}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#77574d]/20 flex justify-between items-center gap-4">
                    <span className="text-xs font-mono text-[#122c1f] truncate">
                        {typeof window !== 'undefined' ? `${window.location.origin}/${lang}/register?ref=${userData?.membershipId}` : '...'}
                    </span>
                    <button 
                        onClick={() => {
                            if (userData?.membershipId) {
                                navigator.clipboard.writeText(`${window.location.origin}/${lang}/register?ref=${userData.membershipId}`);
                                alert(dict.dashboard.referral_box.copied);
                            }
                        }}
                        className="p-2 bg-[#122c1f] text-white rounded-lg hover:rotate-12 transition-transform"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>


            {/* Quick Actions */}
            <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-6 shadow-sm">
                <h4 className="text-lg font-serif font-bold text-[#122c1f]">{dict.dashboard.support.title}</h4>
                <div className="space-y-4">
                    <button className="w-full p-4 bg-[#fbf9f5] rounded-2xl flex items-center gap-4 hover:bg-[#122c1f] hover:text-white transition-all group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#122c1f] shadow-sm">
                            <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">{dict.dashboard.support.expert}</span>
                    </button>
                    <button className="w-full p-4 bg-[#fbf9f5] rounded-2xl flex items-center gap-4 hover:bg-[#122c1f] hover:text-white transition-all group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#122c1f] shadow-sm">
                            <TrendingUp className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">{dict.dashboard.support.market}</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
