'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Gift, Copy, Share2,
  Wallet, Clock, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';

interface Referral {
  id: string;
  referredUserName: string;
  joinedAt: string;
  reward: number;
  paymentConfirmed?: boolean;
}

export default function ReferralsPage() {
  const { user, userData } = useAuth();
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const walletBalance = userData?.walletBalance || 0;
  const referralCode = userData?.membershipId || '';
  const referralLink = referralCode
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}//${lang}/register?ref=${referralCode}`
    : '';

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    (async () => {
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
    })();
  }, [user]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `🌾 Join Kishan Seva Samiti — India's farmer community!\nGet your official Farmer ID card and sell organic products directly.\n\nUse my referral link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#122c1f]">Referral Dashboard</h1>
          <p className="text-[#77574d] mt-1 font-medium">
            Earn ₹7 for every farmer who joins and pays the ₹50 membership fee using your link.
          </p>
        </div>

        <Link
          href={`/${lang}/dashboard/wallet`}
          className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-black/5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <Wallet className="w-5 h-5 text-[#77574d]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Wallet Balance</p>
            <p className="text-xl font-serif font-bold text-[#122c1f]">₹{walletBalance.toFixed(2)}</p>
          </div>
          <div className="ml-2 flex items-center gap-1 text-xs font-bold text-[#122c1f] bg-[#122c1f]/5 px-3 py-1.5 rounded-full">
            Withdraw <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>

      {/* Main Referral Card */}
      <section className="bg-[#122c1f] rounded-[48px] p-10 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#77574d]/30 blur-[120px]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-green-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
              Invite a Farmer,<br />
              <span className="text-green-400 italic font-medium">Earn ₹7 each time.</span>
            </h2>
            <p className="opacity-70 text-base leading-relaxed">
              Share your unique link. When a farmer registers and pays the ₹50 membership fee, ₹7 is instantly credited to your Samiti wallet.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Paid members only
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Instant credit
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 text-[#122c1f] space-y-6 shadow-2xl">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Your Unique Referral Link</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-[#fbf9f5] px-4 py-3 rounded-2xl border border-black/5 text-xs font-mono truncate">
                  {referralLink || 'Complete registration to get your link'}
                </div>
                <button
                  onClick={copyLink}
                  disabled={!referralLink}
                  className="p-3 bg-[#122c1f] text-white rounded-2xl hover:bg-[#122c1f]/90 transition-colors disabled:opacity-30"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/5">
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-[#122c1f]">{userData?.stats?.totalReferrals || 0}</p>
                <p className="text-xs text-[#77574d] mt-1">Total Referrals</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-green-600">₹{userData?.stats?.earnings || 0}</p>
                <p className="text-xs text-[#77574d] mt-1">Total Earned</p>
              </div>
            </div>

            <button
              onClick={shareWhatsApp}
              disabled={!referralLink}
              className="w-full py-4 bg-green-600 text-white rounded-[20px] font-bold uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
            >
              <Share2 className="w-5 h-5" />
              Share on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Referral History */}
      <section className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-[#122c1f]">Referral History</h3>
        <div className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-[#77574d]">Loading referrals...</div>
          ) : referrals.length === 0 ? (
            <div className="p-10 text-center">
              <Users className="w-10 h-10 text-[#122c1f]/20 mx-auto mb-3" />
              <p className="text-[#77574d] text-sm">No referrals yet. Share your link to start earning!</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#122c1f]/5 border-b border-black/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Farmer Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Date Joined</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Payment</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#77574d] text-right">Reward</th>
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
                        <span className="text-sm font-bold text-[#122c1f]">{item.referredUserName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs text-[#77574d]">
                        <Clock className="w-3 h-3" />
                        {new Date(item.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
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
          )}
        </div>
      </section>
    </div>
  );
}
