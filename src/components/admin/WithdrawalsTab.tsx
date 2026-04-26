'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, IndianRupee, User, CreditCard } from 'lucide-react';
import { Withdrawal } from '@/types';

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchWithdrawals();
    }, [fetchWithdrawals]);

    const approveWithdrawal = async (req: Withdrawal) => {
        setProcessing(req.id);
        try {
            // 1. Mark withdrawal as completed
            await updateDoc(doc(db, 'withdrawals', req.id), { status: 'completed' });

            // 2. Deduct the amount from user's walletBalance
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
            // Reject — no balance change (user keeps the balance)
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
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
            status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
        }`}>
            {status === 'completed' ? <CheckCircle className="w-3 h-3" /> :
             status === 'rejected' ? <XCircle className="w-3 h-3" /> :
             <Clock className="w-3 h-3" />}
            {status.toUpperCase()}
        </span>
    );

    const WithdrawalRow = ({ req }: { req: Withdrawal }) => (
        <tr className="hover:bg-gray-50">
            <td className="p-4 text-sm text-gray-500">
                {req.requestedAt?.toDate?.()?.toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                }) || '—'}
            </td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{req.userName}</span>
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-1 font-bold text-gray-900">
                    <IndianRupee className="w-4 h-4" />
                    {req.amount}
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CreditCard className="w-3.5 h-3.5" />
                    {req.upiId
                        ? `UPI: ${req.upiId}`
                        : req.bankAccount
                            ? `Bank: ${req.bankAccount}`
                            : 'No details'}
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                    {req.status === 'pending' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => approveWithdrawal(req)}
                                disabled={processing === req.id}
                                className="text-xs px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded border border-green-200 transition-colors font-medium disabled:opacity-50"
                            >
                                {processing === req.id ? '...' : '✓ Approve & Pay'}
                            </button>
                            <button
                                onClick={() => rejectWithdrawal(req)}
                                disabled={processing === req.id}
                                className="text-xs px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 transition-colors font-medium disabled:opacity-50"
                            >
                                {processing === req.id ? '...' : '✗ Reject'}
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Wallet Withdrawals</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Approving a request deducts the amount from the user&apos;s wallet.
                        Rejecting leaves the balance unchanged.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm font-medium text-yellow-800">
                        <Clock className="w-4 h-4" />
                        {pending.length} Pending
                    </div>
                </div>
            </div>

            {/* Pending requests first */}
            {pending.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-yellow-700">⏳ Pending Approval</p>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-xs text-gray-500 font-medium">Date</th>
                                <th className="p-4 text-xs text-gray-500 font-medium">Farmer</th>
                                <th className="p-4 text-xs text-gray-500 font-medium">Amount</th>
                                <th className="p-4 text-xs text-gray-500 font-medium">Payment Info</th>
                                <th className="p-4 text-xs text-gray-500 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {pending.map(req => <WithdrawalRow key={req.id} req={req} />)}
                        </tbody>
                    </table>
                </div>
            )}

            {/* History */}
            {resolved.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">📋 History</p>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-xs text-gray-500 font-medium">Date</th>
                                <th className="p-4 text-xs text-gray-500 font-medium">Farmer</th>
                                <th className="p-4 text-xs text-gray-500 font-medium">Amount</th>
                                <th className="p-4 text-xs text-gray-500 font-medium">Payment Info</th>
                                <th className="p-4 text-xs text-gray-500 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {resolved.map(req => <WithdrawalRow key={req.id} req={req} />)}
                        </tbody>
                    </table>
                </div>
            )}

            {loading && (
                <div className="text-center py-10 text-gray-500">Loading withdrawal requests...</div>
            )}
            {!loading && withdrawals.length === 0 && (
                <div className="bg-white rounded-xl border p-10 text-center text-gray-500">
                    No withdrawal requests found.
                </div>
            )}
        </div>
    );
}

