'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, CheckCircle2, XCircle, Clock, 
  Search, Filter, IndianRupee, ExternalLink 
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: unknown;
  paymentId?: string;
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const { dict, lang } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.uid) return;

    const fetchTransactions = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('buyerId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          orderId: doc.data().orderId || doc.id,
          amount: doc.data().totalAmount,
          status: doc.data().status,
          paymentStatus: doc.data().paymentStatus,
          createdAt: doc.data().createdAt,
          paymentId: doc.data().paymentId
        })) as Transaction[];
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const filteredTransactions = transactions.filter(t => 
    t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.paymentId && t.paymentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#122c1f]">Payment History</h1>
          <p className="text-[#77574d] mt-1">Track all your transactions and payment statuses.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#77574d] uppercase tracking-wider">Successful</span>
          </div>
          <p className="text-3xl font-serif font-bold text-[#122c1f]">
            {transactions.filter(t => t.paymentStatus === 'paid').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#77574d] uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-3xl font-serif font-bold text-[#122c1f]">
            {transactions.filter(t => t.paymentStatus === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#77574d] uppercase tracking-wider">Failed</span>
          </div>
          <p className="text-3xl font-serif font-bold text-[#122c1f]">
            {transactions.filter(t => t.paymentStatus === 'failed').length}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77574d]/40" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#fbf9f5] rounded-2xl text-sm focus:ring-2 focus:ring-[#122c1f]/10 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#fbf9f5] rounded-2xl text-sm font-bold text-[#122c1f] hover:bg-black/5 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbf9f5] text-[10px] font-bold uppercase tracking-widest text-[#77574d]">
                <th className="px-8 py-4">Transaction Details</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-[#77574d]">
                    <div className="flex flex-col items-center gap-3">
                      <Clock className="w-8 h-8 animate-spin text-[#122c1f]/20" />
                      <p>Loading transactions...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-[#77574d]">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="w-8 h-8 text-[#122c1f]/20" />
                      <p>No transactions found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#fbf9f5]/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#122c1f] text-sm">Order: {t.orderId}</span>
                        {t.paymentId && (
                          <span className="text-[10px] font-mono text-[#77574d] mt-0.5">ID: {t.paymentId}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 font-bold text-[#122c1f]">
                        <IndianRupee className="w-3 h-3" />
                        {t.amount}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-[#77574d]">
                        {t.createdAt?.toDate?.()?.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        t.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        t.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {t.paymentStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> :
                         t.paymentStatus === 'failed' ? <XCircle className="w-3 h-3" /> :
                         <Clock className="w-3 h-3" />}
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-[#77574d] hover:text-[#122c1f] transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
