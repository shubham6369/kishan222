'use client';

import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  ChevronRight, 
  ArrowUpRight,
  Gift,
  Bell,
  CreditCard,
  CheckCircle2,
  Printer,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { Dictionary } from '@/context/LanguageContext';
import FarmerCardVisual from './FarmerCardVisual';

interface Referral {
  id: string;
  referredUserName: string;
  joinedAt: string;
  reward: number;
  paymentConfirmed?: boolean;
}

interface DashboardContentProps {
  lang: string;
  dict: Dictionary;
}

export default function DashboardContent({ lang, dict }: DashboardContentProps) {
  const { user, userData, loading: authLoading } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = async (side: 'front' | 'back') => {
    const element = document.getElementById(`farmer-card-${side}`);
    if (!element) {
      alert('Card element not found.');
      return;
    }
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Farmer_ID_${side === 'front' ? 'Front' : 'Back'}_${userData?.membershipId || 'Card'}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating card image:', err);
      alert('Failed to download card. Please try using print to save as PDF.');
    }
  };

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.uid) {
          setLoadingReferrals(false);
          return;
      }
      
      try {
        // Fetch Referrals
        const refQuery = query(
          collection(db, 'users', user.uid, 'referrals'),
          orderBy('joinedAt', 'desc'),
          limit(5)
        );
        const refSnapshot = await getDocs(refQuery);
        setReferrals(refSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Referral[]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoadingReferrals(false);
      }
    }
    fetchDashboardData();
  }, [user]);
  
  const stats = [
    { 
      name: dict.dashboard?.stats?.earnings || "Growth Rewards", 
      value: `₹${userData?.stats?.earnings || 0}`, 
      change: `+₹0 ${dict.dashboard?.stats?.today || "today"}`, 
      icon: Gift, 
      color: 'bg-orange-100 text-orange-600' 
    },
    { 
      name: dict.dashboard?.stats?.referrals || "Total Referrals", 
      value: userData?.stats?.totalReferrals || 0, 
      change: dict.dashboard?.stats?.lifetime || "Lifetime", 
      icon: Users, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      name: lang === 'en' ? "Card Status" : "कार्ड की स्थिति", 
      value: userData?.membershipId ? (lang === 'hi' ? 'सत्यापित' : 'Verified') : (lang === 'hi' ? 'लंबित' : 'Pending'), 
      change: lang === 'en' ? "Lifetime Access" : "आजीवन पहुंच", 
      icon: CreditCard, 
      color: 'bg-emerald-100 text-emerald-600' 
    },
  ];

  if (authLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <m.div 
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
          <h1 className="text-4xl font-serif font-bold text-[#122c1f]">{dict.dashboard?.jai_kisan || "Jai Kisan"}, <span className="text-[#77574d]">{userData?.fullName?.split(' ')[0] || dict.dashboard?.farmer || "Farmer"}</span>!</h1>
          <p className="text-[#77574d] mt-1 font-medium">{dict.dashboard?.welcome || "Welcome back to your Seva Portal."}</p>
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
                    <p className="text-[10px] text-[#77574d]">{dict.dashboard?.farmer || "Farmer"}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <m.div
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
          </m.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Identity & Referral */}
        <div className="lg:col-span-2 space-y-12">
            
            {/* Membership Card Preview Banner */}
            <div className="p-8 sm:p-10 bg-white rounded-[40px] border border-black/5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#77574d]/5 blur-[80px]" />
                
                <style>{`
                  @media print {
                    body * {
                      visibility: hidden !important;
                    }
                    #printable-card-area, #printable-card-area * {
                      visibility: visible !important;
                    }
                    #printable-card-area {
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      width: 100% !important;
                      height: auto !important;
                      display: flex !important;
                      flex-direction: column !important;
                      align-items: center !important;
                      justify-content: center !important;
                      gap: 40px !important;
                      padding: 20px 0 !important;
                      margin: 0 !important;
                      background: white !important;
                      transform: none !important;
                    }
                    @page {
                      size: auto;
                      margin: 10mm;
                    }
                  }
                `}</style>

                <div className="relative z-10 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-black/5 pb-6">
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-[#122c1f]">
                                {lang === 'en' ? "Your Membership Card" : "आपका सदस्यता कार्ड"}
                            </h3>
                            <p className="text-sm text-[#77574d] mt-1">
                                {lang === 'en' ? "Verify, download, or print your official Smart ID Card." : "अपने आधिकारिक स्मार्ट आईडी कार्ड को सत्यापित, डाउनलोड या प्रिंट करें।"}
                            </p>
                        </div>
                        <Link 
                          href={`/${lang}/dashboard/card`}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-[#122c1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#122c1f]/90 hover:scale-105 transition-all self-start sm:self-auto shadow-md"
                        >
                            <Printer className="w-4 h-4" />
                            {lang === 'en' ? "Full View & Instructions" : "पूर्ण दृश्य और निर्देश"}
                        </Link>
                    </div>

                    <div className="py-2 flex flex-col items-center">
                        <div id="printable-card-area" className="w-full flex justify-center py-4 bg-[#fbf9f5]/50 rounded-[32px] border border-dashed border-[#77574d]/10 px-6">
                            <FarmerCardVisual userData={userData} lang={lang} />
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-3 mt-6 print:hidden">
                            <button 
                                onClick={() => handleDownload('front')}
                                className="px-4 py-2.5 bg-[#122c1f]/5 border border-[#122c1f]/10 text-[#122c1f] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/10 transition shadow-sm"
                            >
                                <Download className="w-4 h-4 text-[#122c1f]" />
                                {lang === 'en' ? "Download Front" : "सामने का भाग डाउनलोड"}
                            </button>
                            <button 
                                onClick={() => handleDownload('back')}
                                className="px-4 py-2.5 bg-[#122c1f]/5 border border-[#122c1f]/10 text-[#122c1f] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/10 transition shadow-sm"
                            >
                                <Download className="w-4 h-4 text-[#122c1f]" />
                                {lang === 'en' ? "Download Back" : "पीछे का भाग डाउनलोड"}
                            </button>
                            <button 
                                onClick={handlePrint}
                                className="px-4 py-2.5 bg-[#122c1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#122c1f]/90 transition shadow-md"
                            >
                                <Printer className="w-4 h-4" />
                                {lang === 'en' ? "Print Card" : "कार्ड प्रिंट करें"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Referrals */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.dashboard?.referrals?.title || "Recent Referrals"}</h3>
                        <p className="text-sm text-[#77574d]">{dict.dashboard?.referrals?.subtitle || "Farmers who joined using your unique link."}</p>
                    </div>
                    <Link href={`/${lang}/dashboard/referrals`} className="text-xs font-bold uppercase tracking-widest text-[#122c1f] flex items-center gap-2 group">
                        {dict.dashboard?.referrals?.view_all || "View All"} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="bg-white rounded-[32px] border border-black/5 overflow-hidden shadow-sm">
                    {loadingReferrals ? (
                        <div className="p-12 text-center text-[#77574d] italic text-sm">{dict.dashboard?.referrals?.loading || "Loading referrals..."}</div>
                    ) : referrals.length > 0 ? (
                        <div className="divide-y divide-black/5">
                            {referrals.map((referral) => (
                                <div key={referral.id} className="p-6 flex justify-between items-center hover:bg-[#fbf9f5] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#122c1f]">{referral.referredUserName || dict.dashboard?.referrals?.unknown || "Unknown Farmer"}</p>
                                            <p className="text-[10px] text-[#77574d] uppercase tracking-wider">{referral.joinedAt ? new Date(referral.joinedAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN') : dict.dashboard?.referrals?.recently || "recently"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">+₹{referral.reward}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-[#77574d]">{dict.dashboard?.referrals?.earned || "Earned"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-[#77574d] italic text-sm">
                            {dict.dashboard?.referrals?.none || "No recent referrals found. Start sharing to earn rewards!"}
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
                    <h4 className="text-xl font-serif font-bold text-[#122c1f]">{dict.dashboard?.wallet?.title || "Your Wallet"}</h4>
                    <span className="p-2 bg-[#fbf9f5] rounded-xl"><Gift className="w-5 h-5 text-[#77574d]" /></span>
                </div>
                <div>
                    <p className="text-sm text-[#77574d] mb-1">{dict.dashboard?.wallet?.balance || "Available Balance"}</p>
                    <h3 className="text-4xl font-serif font-bold text-[#122c1f]">₹{userData?.walletBalance || 0}</h3>
                </div>
                <Link 
                  href={`/${lang}/dashboard/wallet`}
                  className="block text-center w-full py-4 bg-[#122c1f] text-white rounded-2xl font-bold tracking-wider hover:bg-[#122c1f]/90 transition shadow-md"
                >
                    {lang === 'en' ? "Open Wallet" : "वॉलेट खोलें"}
                </Link>
            </div>

            {/* Referral Link Box */}
            <div className="p-8 bg-[#77574d]/5 rounded-[32px] border border-[#77574d]/10 space-y-6">
                <div className="w-12 h-12 bg-[#77574d] rounded-2xl flex items-center justify-center shadow-lg shadow-[#77574d]/20">
                    <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-serif font-bold text-[#122c1f]">{dict.dashboard?.referral_box?.title || "Spread the Growth"}</h4>
                    <p className="text-sm text-[#77574d] italic">{dict.dashboard?.referral_box?.subtitle || "Strengthen our community network and receive verified member rewards."}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#77574d]/20 flex justify-between items-center gap-4">
                    <span className="text-xs font-mono text-[#122c1f] truncate">
                        {typeof window !== 'undefined' ? `${window.location.origin}/${lang}/register?ref=${userData?.membershipId}` : '...'}
                    </span>
                    <button 
                        onClick={() => {
                            if (userData?.membershipId) {
                                navigator.clipboard.writeText(`${window.location.origin}/${lang}/register?ref=${userData.membershipId}`);
                                alert(dict.dashboard?.referral_box?.copied || "Link copied!");
                            }
                        }}
                        className="p-2 bg-[#122c1f] text-white rounded-lg hover:rotate-12 transition-transform shrink-0"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-6 shadow-sm">
                <h4 className="text-lg font-serif font-bold text-[#122c1f]">{dict.dashboard?.support?.title || "Direct Support"}</h4>
                <div className="space-y-4">
                    <Link 
                      href={`/${lang}/contact`} 
                      className="w-full p-4 bg-[#fbf9f5] rounded-2xl flex items-center gap-4 hover:bg-[#122c1f] hover:text-white transition-all group"
                    >
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#122c1f] shadow-sm">
                            <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">{dict.dashboard?.support?.expert || "Expert Advice"}</span>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
