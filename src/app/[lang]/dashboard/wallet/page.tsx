'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowDownToLine, Clock, CheckCircle2, XCircle,
  AlertCircle, IndianRupee, Gift, TrendingUp
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const MIN_WITHDRAWAL = 100;

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  requestedAt: any;
  upiId?: string;
}

export default function WalletPage() {
  const { user, userData } = useAuth();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const walletBalance = userData?.walletBalance || 0;

  useEffect(() => {
    if (!user?.uid) { setLoadingHistory(false); return; }
    (async () => {
      try {
        const q = query(
          collection(db, 'withdrawals'),
          orderBy('requestedAt', 'desc')
        );
        const snap = await getDocs(q);
        const myRequests = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as WithdrawalRequest))
          .filter(w => (w as any).userId === user.uid);
        setWithdrawals(myRequests);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingHistory(false);
      }
    })();
  }, [user]);

  const handleWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (!upiId.trim()) { toast.error('Please enter your UPI ID.'); return; }
    if (isNaN(amount) || amount <= 0) { toast.error('Enter a valid amount.'); return; }
    if (amount > walletBalance) { toast.error(`You can't withdraw more than your balance ₹${walletBalance}.`); return; }
    if (walletBalance < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal balance is ₹${MIN_WITHDRAWAL}. Your current balance is ₹${walletBalance}.`);
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'withdrawals'), {
        userId: user!.uid,
        userName: userData?.fullName || 'Farmer',
        amount,
        upiId: upiId.trim(),
        status: 'pending',
        requestedAt: serverTimestamp(),
      });
      toast.success('Withdrawal request submitted! Admin will process it within 24 hours.');
      setShowForm(false);
      setUpiId('');
      setWithdrawAmount('');
      // Optimistically add to local state
      setWithdrawals(prev => [{
        id: Date.now().toString(),
        amount,
        status: 'pending',
        requestedAt: { toDate: () => new Date() },
        upiId: upiId.trim(),
      }, ...prev]);
    } catch (err: any) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canWithdraw = walletBalance >= MIN_WITHDRAWAL;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <Toaster position="top-center" />

      {/* Balance Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#122c1f] rounded-[40px] p-10 text-white overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 font-bold">Samiti Wallet</p>
              <p className="text-sm text-white/70">Referral Earnings</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-white/50 text-sm mb-1">Available Balance</p>
            <p className="text-6xl font-serif font-bold text-white">₹{walletBalance.toFixed(2)}</p>
          </div>

          {!canWithdraw && (
            <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-2xl px-5 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-yellow-300 shrink-0" />
              <p className="text-yellow-200 text-sm">
                Minimum ₹{MIN_WITHDRAWAL} required to withdraw. 
                You need ₹{(MIN_WITHDRAWAL - walletBalance).toFixed(2)} more.
              </p>
            </div>
          )}

          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!canWithdraw}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all ${
              canWithdraw
                ? 'bg-white text-[#122c1f] hover:bg-green-50 hover:scale-105 shadow-xl'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            Request Withdrawal
          </button>
        </div>
      </motion.div>

      {/* Withdrawal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            key="withdraw-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleWithdrawRequest}
            className="bg-white rounded-[32px] border border-black/5 shadow-sm p-8 space-y-6 overflow-hidden"
          >
            <h3 className="text-xl font-serif font-bold text-[#122c1f]">Withdrawal Request</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-5 py-4 bg-[#fbf9f5] rounded-2xl text-[#122c1f] focus:ring-2 focus:ring-[#122c1f]/10 border-none outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">
                Amount (Max: ₹{walletBalance})
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#77574d]/40" />
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={walletBalance}
                  min={1}
                  className="w-full pl-12 pr-4 py-4 bg-[#fbf9f5] rounded-2xl text-[#122c1f] focus:ring-2 focus:ring-[#122c1f]/10 border-none outline-none"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-[#77574d] bg-[#fbf9f5] rounded-xl px-4 py-3">
              ⚠️ Admin reviews all withdrawal requests within 24 hours. Approved amounts will be sent directly to your UPI ID.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-4 border border-black/10 rounded-2xl font-bold text-[#122c1f] hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 bg-[#122c1f] text-white rounded-2xl font-bold hover:bg-[#122c1f]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Withdrawal History */}
      <section className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-[#122c1f]">Withdrawal History</h3>
        {loadingHistory ? (
          <div className="text-center py-10 text-[#77574d]">Loading...</div>
        ) : withdrawals.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-black/5 p-10 text-center">
            <TrendingUp className="w-10 h-10 text-[#122c1f]/20 mx-auto mb-3" />
            <p className="text-[#77574d] text-sm">No withdrawal requests yet.</p>
            <p className="text-[#77574d]/60 text-xs mt-1">Earn ₹7 per referral and withdraw when you reach ₹100.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-black/5 overflow-hidden shadow-sm divide-y divide-black/5">
            {withdrawals.map(req => (
              <div key={req.id} className="flex items-center justify-between px-8 py-5">
                <div>
                  <p className="font-bold text-[#122c1f] text-sm">₹{req.amount} → {req.upiId}</p>
                  <p className="text-xs text-[#77574d] mt-0.5">
                    {req.requestedAt?.toDate?.()?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) || 'Pending...'}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  req.status === 'completed' ? 'bg-green-100 text-green-700' :
                  req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {req.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                   req.status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                   <Clock className="w-3 h-3" />}
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
