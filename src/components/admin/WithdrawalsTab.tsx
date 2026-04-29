'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, IndianRupee, User, CreditCard, History } from 'lucide-react';
import { Withdrawal } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function WithdrawalsTab() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchWithdrawals = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'withdrawals'));
            const fetched: Withdrawal[] = [];
            querySnapshot.forEach((d) => {
                fetched.push({ id: d.id, ...d.data() } as Withdrawal);
            });
            
            fetched.sort((a, b) => {
                const timeA = a.requestedAt?.toMillis?.() || 0;
                const timeB = b.requestedAt?.toMillis?.() || 0;
                return timeB - timeA;
            });
            setWithdrawals(fetched);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await fetchWithdrawals();
        };
        init();
    }, [fetchWithdrawals]);

    const approveWithdrawal = async (req: Withdrawal) => {
        setProcessing(req.id);
        try {
            await updateDoc(doc(db, 'withdrawals', req.id), { status: 'completed' });
            await updateDoc(doc(db, 'users', req.userId), {
                walletBalance: increment(-req.amount),
            });

            setWithdrawals(prev =>
                prev.map(w => w.id === req.id ? { ...w, status: 'completed' } : w)
            );
            toast.success(`₹${req.amount} approved for ${req.userName}. Balance deducted.`);
        } catch (error) {
            console.error('Error approving withdrawal:', error);
            toast.error('Failed to approve withdrawal.');
        } finally {
            setProcessing(null);
        }
    };

    const rejectWithdrawal = async (req: Withdrawal) => {
        setProcessing(req.id);
        try {
            await updateDoc(doc(db, 'withdrawals', req.id), { status: 'rejected' });
            setWithdrawals(prev =>
                prev.map(w => w.id === req.id ? { ...w, status: 'rejected' } : w)
            );
            toast.success(`Withdrawal rejected. ${req.userName}'s balance unchanged.`);
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
            toast.error('Failed to reject withdrawal.');
        } finally {
            setProcessing(null);
        }
    };

    const pending = withdrawals.filter(w => w.status === 'pending');
    const resolved = withdrawals.filter(w => w.status !== 'pending');

    const StatusBadge = ({ status }: { status: string }) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
          status === 'completed' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
          status === 'rejected' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
          'bg-orange-400/10 text-orange-400 border-orange-400/20'
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
            status === 'completed' ? "bg-emerald-400" : status === 'rejected' ? "bg-red-400" : "bg-orange-400"
          )} />
          {status}
        </span>
    );

    const WithdrawalRow = ({ req, isPending }: { req: Withdrawal, isPending: boolean }) => (
        <motion.tr 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="group hover:bg-white/5 transition-all"
        >
            <td className="px-8 py-6 text-xs text-white/40 font-mono">
                {req.requestedAt?.toDate?.()?.toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                }) || '—'}
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                        <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-sm">{req.userName}</span>
                </div>
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-1 font-black text-accent text-lg">
                    <IndianRupee className="w-4 h-4" />
                    {req.amount}
                </div>
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <CreditCard className="w-3.5 h-3.5 text-accent" />
                    {req.upiId
                        ? `UPI: ${req.upiId}`
                        : req.bankAccount
                            ? `Bank: ${req.bankAccount}`
                            : 'No details'}
                </div>
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center justify-end gap-4">
                    <StatusBadge status={req.status} />
                    {isPending && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <button
                                onClick={() => approveWithdrawal(req)}
                                disabled={processing === req.id}
                                className="p-2 bg-emerald-400/10 text-emerald-400 rounded-xl hover:bg-emerald-400 hover:text-primary transition-all shadow-lg shadow-emerald-400/10"
                                title="Approve & Pay"
                            >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => rejectWithdrawal(req)}
                                disabled={processing === req.id}
                                className="p-2 bg-red-400/10 text-red-400 rounded-xl hover:bg-red-400 hover:text-white transition-all shadow-lg shadow-red-400/10"
                                title="Reject Request"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </motion.tr>
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Withdrawal Requests</h2>
                    <p className="text-white/40 text-sm mt-1">Manage platform payouts and wallet settlements</p>
                </div>
                <div className={cn(
                  "px-6 py-3 rounded-2xl border flex items-center gap-3 transition-all",
                  pending.length > 0 
                    ? "bg-orange-400/10 border-orange-400/20 text-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.1)]" 
                    : "bg-white/5 border-white/10 text-white/40"
                )}>
                    <Clock className={cn("w-5 h-5", pending.length > 0 && "animate-pulse")} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{pending.length} Pending Approval</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <div key="loading" className="py-20 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Scanning Ledger...</p>
                </div>
              ) : (
                <div key="content" className="space-y-12">
                  {/* Pending requests */}
                  {pending.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl">
                        <div className="px-8 py-5 bg-orange-400/10 border-b border-orange-400/10 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping" />
                              Action Required
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                              <thead>
                                  <tr className="border-b border-white/10">
                                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Date</th>
                                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Farmer</th>
                                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Amount</th>
                                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Payment Details</th>
                                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Decision</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                  {pending.map(req => <WithdrawalRow key={req.id} req={req} isPending={true} />)}
                              </tbody>
                          </table>
                        </div>
                    </div>
                  )}

                  {/* History */}
                  <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl opacity-80 hover:opacity-100 transition-opacity">
                      <div className="px-8 py-5 border-b border-white/10 flex items-center gap-3 text-white/40">
                          <History className="w-4 h-4" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Settlement History</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-white/5">
                                {resolved.length > 0 ? (
                                  resolved.map(req => <WithdrawalRow key={req.id} req={req} isPending={false} />)
                                ) : (
                                  <tr>
                                    <td className="px-8 py-10 text-center text-white/20 text-xs font-bold uppercase tracking-widest">
                                      No historical data available
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                        </table>
                      </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
        </div>
    );
}

