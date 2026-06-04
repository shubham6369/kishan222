'use client';

import React, { useEffect, useState } from 'react';
import {
  Users, Gift, Copy, Share2,
  Wallet, Clock, CheckCircle2, AlertCircle, ArrowRight,
  Network, Layers, ChevronDown, ChevronUp, HelpCircle, Award
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Dictionary } from '@/context/LanguageContext';

interface Referral {
  id: string;
  referredUserName: string;
  referredUserPhone?: string;
  joinedAt: string;
  reward: number;
  paymentConfirmed?: boolean;
  level?: number;
}

interface ReferralsContentProps {
  lang: string;
  dict: Dictionary;
}

const COMMISSION_RATES: Record<string, number> = {
  "1": 7.00,
  "2": 4.00,
  "3": 2.50,
  "4": 1.50,
  "5": 1.00,
  "6": 0.75,
  "7": 0.50,
  "8": 0.25,
  "9": 0.25,
  "10": 0.25,
};

export default function ReferralsContent({ lang, dict }: ReferralsContentProps) {
  const { user, userData } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({ "1": true });

  const walletBalance = userData?.walletBalance || 0;
  const referralCode = userData?.membershipId || '';
  const referralLink = referralCode
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${lang}/register?cid=${referralCode}`
    : '';

  const isHi = lang === 'hi';
  const t = {
    title: isHi ? "सामुदायिक आउटरीच एवं नेटवर्क" : "Community Outreach & Network",
    subtitle: isHi ? "अपने नेटवर्क को बढ़ाएं और 10 स्तरों तक कमाई प्राप्त करें।" : "Grow your network and earn commissions up to 10 levels.",
    networkSize: isHi ? "कुल नेटवर्क आकार" : "Total Network Size",
    directRefs: isHi ? "प्रत्यक्ष सदस्य (स्तर 1)" : "Direct Members (Level 1)",
    indirectRefs: isHi ? "अप्रत्यक्ष सदस्य (स्तर 2-10)" : "Indirect Members (Level 2-10)",
    totalEarnings: isHi ? "कुल अर्जित पुरस्कार" : "Total Rewards Earned",
    membersUnit: isHi ? "किसान" : "Farmers",
    inviteFarmer: isHi ? "किसानों को आमंत्रित करें" : "Invite a Farmer",
    inviteSubtitle: isHi ? "जब भी कोई नया सदस्य आपके नेटवर्क में जुड़ता है, तो आपको 10 स्तरों तक कमीशन मिलता है!" : "Earn rewards down to 10 levels when new farmers join your network!",
    uniqueLink: isHi ? "आपका विशिष्ट रेफरल लिंक" : "Your Unique Referral Link",
    copySuccess: isHi ? "लिंक कॉपी हो गया!" : "Link copied!",
    history: isHi ? "रेफरल इतिहास" : "Referral History",
    noReferrals: isHi ? "अभी तक कोई रेफरल नहीं मिला है। पुरस्कार पाने के लिए लिंक साझा करना शुरू करें!" : "No referrals found yet. Start sharing to earn rewards!",
    levelBreakdown: isHi ? "10-स्तरीय नेटवर्क विश्लेषण" : "10-Level Network Breakdown",
    levelLabel: isHi ? "स्तर" : "Level",
    commissionPerUser: isHi ? "प्रति सदस्य कमीशन" : "Commission per Member",
    membersCount: isHi ? "सदस्य संख्या" : "Members Count",
    earnedLabel: isHi ? "अर्जित राशि" : "Earned",
    legendTitle: isHi ? "10-स्तरीय कमीशन संरचना" : "10-Level Commission Structure",
    legendDesc: isHi ? "जब भी कोई किसान आपके नेटवर्क में ₹50 सदस्यता शुल्क देकर जुड़ता है, तो कमीशन इस प्रकार वितरित होता है:" : "When a farmer joins your network by paying the ₹50 membership fee, commissions are distributed as follows:",
    historyName: isHi ? "किसान का नाम" : "Farmer Name",
    historyDate: isHi ? "जुड़ने की तिथि" : "Date Joined",
    historyLevel: isHi ? "नेटवर्क स्तर" : "Network Level",
    historyPayment: isHi ? "भुगतान स्थिति" : "Payment Status",
    historyReward: isHi ? "पुरस्कार" : "Reward",
  };

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'users', user.uid, 'referrals'),
          orderBy('joinedAt', 'desc')
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Referral));
        setReferrals(docs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [user]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert(t.copySuccess);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `🌾 Join Kishan Seva — India's farmer community!\nGet your official Farmer ID card and sell organic products directly.\n\nUse my community link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const toggleLevelExpand = (level: string) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  // Compile MLM totals from user document stats
  const stats = userData?.stats;
  const levelCounts = stats?.levelCounts || {};
  const levelEarnings = stats?.levelEarnings || {};

  const levelKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  
  const totalDirectReferrals = Number(levelCounts["1"] || stats?.totalReferrals || 0);
  const totalIndirectReferrals = levelKeys.slice(1).reduce((acc, k) => acc + Number(levelCounts[k] || 0), 0);
  const totalNetworkSize = totalDirectReferrals + totalIndirectReferrals;

  const totalDirectEarnings = Number(levelEarnings["1"] || stats?.earnings || 0);
  const totalIndirectEarnings = levelKeys.slice(1).reduce((acc, k) => acc + Number(levelEarnings[k] || 0), 0);
  const totalEarnings = totalDirectEarnings + totalIndirectEarnings;

  // Custom level badges styles
  const getLevelBadge = (level?: number) => {
    const lvl = level || 1;
    if (lvl === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
          Level 1 (Direct)
        </span>
      );
    }
    if (lvl === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
          Level 2 (Indirect)
        </span>
      );
    }
    if (lvl === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
          Level 3 (Indirect)
        </span>
      );
    }
    if (lvl === 4) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
          Level 4 (Indirect)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
        Level {lvl} (Indirect)
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#122c1f]">{t.title}</h1>
          <p className="text-[#77574d] mt-1 font-medium">{t.subtitle}</p>
        </div>

        <Link
          href={`/${lang}/dashboard/wallet`}
          className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-black/5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <Wallet className="w-5 h-5 text-[#77574d]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.dashboard.wallet.title}</p>
            <p className="text-xl font-serif font-bold text-[#122c1f]">₹{walletBalance.toFixed(2)}</p>
          </div>
          <div className="ml-2 flex items-center gap-1 text-xs font-bold text-[#122c1f] bg-[#122c1f]/5 px-3 py-1.5 rounded-full">
            Withdraw <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>

      {/* Network Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Network Size */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="p-3 bg-[#122c1f]/5 rounded-2xl text-[#122c1f]">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#77574d] uppercase tracking-wide">{t.networkSize}</p>
            <h3 className="text-2xl font-serif font-bold text-[#122c1f] mt-1">{totalNetworkSize} {t.membersUnit}</h3>
          </div>
        </div>

        {/* Level 1 Count */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#77574d] uppercase tracking-wide">{t.directRefs}</p>
            <h3 className="text-2xl font-serif font-bold text-[#122c1f] mt-1">{totalDirectReferrals} {t.membersUnit}</h3>
          </div>
        </div>

        {/* Level 2-10 Count */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#77574d] uppercase tracking-wide">{t.indirectRefs}</p>
            <h3 className="text-2xl font-serif font-bold text-[#122c1f] mt-1">{totalIndirectReferrals} {t.membersUnit}</h3>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="p-3 bg-green-50 rounded-2xl text-green-600">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#77574d] uppercase tracking-wide">{t.totalEarnings}</p>
            <h3 className="text-2xl font-serif font-bold text-green-600 mt-1">₹{totalEarnings.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Main Referral Sharing Panel */}
      <section className="bg-[#122c1f] rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#77574d]/20 blur-[100px] pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Award className="w-7 h-7 text-green-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
              {t.inviteFarmer}<br />
              <span className="text-green-400 italic font-medium">Earn up to 10 levels deep.</span>
            </h2>
            <p className="opacity-70 text-sm leading-relaxed">
              {t.inviteSubtitle}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                Level 1: ₹7
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                Level 2: ₹4
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                Level 3: ₹2.5
              </div>
              <button 
                onClick={() => setShowLegend(!showLegend)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/20 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-green-300" />
                {showLegend ? "Hide All Levels" : "View All 10 Levels"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 text-[#122c1f] space-y-6 shadow-2xl">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{t.uniqueLink}</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#fbf9f5] px-4 py-3 rounded-xl border border-black/5 text-xs font-mono truncate flex items-center">
                  {referralLink || 'Complete registration to get your link'}
                </div>
                <button
                  onClick={copyLink}
                  disabled={!referralLink}
                  className="p-3 bg-[#122c1f] text-white rounded-xl hover:bg-[#122c1f]/90 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/5">
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-[#122c1f]">{totalNetworkSize}</p>
                <p className="text-[10px] font-bold text-[#77574d] uppercase tracking-wider mt-1">Network Size</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-green-600">₹{totalEarnings.toFixed(2)}</p>
                <p className="text-[10px] font-bold text-[#77574d] uppercase tracking-wider mt-1">Total Rewards</p>
              </div>
            </div>

            <button
              onClick={shareWhatsApp}
              disabled={!referralLink}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-30 cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              Share on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* 10-Level MLM Commission Structure Legend */}
      {(showLegend || expandedLevels) && (
        <section className="bg-white rounded-3xl border border-black/5 p-8 shadow-sm space-y-6">
          <div className="border-b border-black/5 pb-4">
            <h3 className="text-2xl font-serif font-bold text-[#122c1f]">{t.legendTitle}</h3>
            <p className="text-sm text-[#77574d] mt-1">{t.legendDesc}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {levelKeys.map((lvl) => (
              <div key={lvl} className="p-4 bg-[#fbf9f5] rounded-2xl border border-black/[0.03] text-center space-y-1">
                <span className="text-xs font-bold text-[#77574d] uppercase">Level {lvl}</span>
                <p className="text-xl font-serif font-bold text-[#122c1f]">₹{COMMISSION_RATES[lvl].toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Network Levels Accordion Grid */}
      <section className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-[#122c1f]">{t.levelBreakdown}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levelKeys.map((lvl) => {
            const count = Number(levelCounts[lvl] || 0);
            const earnings = Number(levelEarnings[lvl] || 0);
            const isExpanded = expandedLevels[lvl];

            return (
              <div 
                key={lvl} 
                className="bg-white rounded-3xl border border-black/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleLevelExpand(lvl)}
                  className="w-full p-6 flex justify-between items-center hover:bg-[#fbf9f5]/50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#122c1f]/5 flex items-center justify-center font-serif font-bold text-[#122c1f] text-sm">
                      {lvl}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#122c1f]">
                        {lvl === "1" ? "Level 1 (Direct)" : `Level ${lvl} (Indirect)`}
                      </h4>
                      <p className="text-[10px] text-[#77574d] tracking-wider uppercase font-semibold">
                        Payout: ₹{COMMISSION_RATES[lvl].toFixed(2)} / member
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#122c1f]">{count} {t.membersUnit}</p>
                      <p className="text-xs font-bold text-green-600">₹{earnings.toFixed(2)}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#77574d]" /> : <ChevronDown className="w-4 h-4 text-[#77574d]" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-black/[0.03] bg-[#fbf9f5]/20 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#122c1f] rounded-full transition-all duration-500" 
                          style={{ width: `${totalNetworkSize > 0 ? (count / totalNetworkSize) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#77574d] shrink-0">
                        {totalNetworkSize > 0 ? Math.round((count / totalNetworkSize) * 100) : 0}% network
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-[#fbf9f5] p-3 rounded-xl border border-black/[0.02]">
                        <p className="text-[#77574d] font-semibold">{t.commissionPerUser}</p>
                        <p className="text-base font-bold text-[#122c1f] mt-0.5">₹{COMMISSION_RATES[lvl].toFixed(2)}</p>
                      </div>
                      <div className="bg-[#fbf9f5] p-3 rounded-xl border border-black/[0.02]">
                        <p className="text-[#77574d] font-semibold">{t.earnedLabel}</p>
                        <p className="text-base font-bold text-green-600 mt-0.5">₹{earnings.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Referral History */}
      <section className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-[#122c1f]">{t.history}</h3>
        <div className="bg-white rounded-[32px] border border-black/5 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-[#77574d] italic text-sm">{dict.dashboard.referrals.loading}</div>
          ) : referrals.length === 0 ? (
            <div className="p-10 text-center">
              <Users className="w-10 h-10 text-[#122c1f]/20 mx-auto mb-3" />
              <p className="text-[#77574d] text-sm">{t.noReferrals}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#122c1f]/5 border-b border-black/5">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{t.historyName}</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{t.historyDate}</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{t.historyLevel}</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{t.historyPayment}</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d] text-right">{t.historyReward}</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((item) => (
                    <tr key={item.id} className="border-b border-black/5 last:border-0 hover:bg-[#fbf9f5] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#122c1f]/5 flex items-center justify-center text-[#122c1f] font-bold text-xs uppercase">
                            {item.referredUserName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#122c1f] block">{item.referredUserName}</span>
                            {item.referredUserPhone && (
                              <span className="text-[10px] font-mono text-[#77574d] mt-0.5 block">
                                +91 ******{item.referredUserPhone.slice(-4)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-xs text-[#77574d]">
                          <Clock className="w-3 h-3" />
                          {new Date(item.joinedAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {getLevelBadge(item.level)}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.paymentConfirmed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {item.paymentConfirmed
                            ? <><CheckCircle2 className="w-3 h-3" /> Paid</>
                            : <><AlertCircle className="w-3 h-3" /> Pending</>
                          }
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={`text-sm font-bold ${item.reward > 0 ? 'text-green-600' : 'text-[#77574d]'}`}>
                          {item.reward > 0 ? `+ ₹${item.reward.toFixed(2)}` : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
