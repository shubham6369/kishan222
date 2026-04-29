'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, ShoppingBag, User, Calendar, Hash, IndianRupee, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Order } from '@/types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function OrdersTab() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'orders'));
            const fetchedOrders: Order[] = [];
            querySnapshot.forEach((doc) => {
                fetchedOrders.push({
                    id: doc.id,
                    ...doc.data()
                } as Order);
            });
            // Client-side sort by createdAt descending
            fetchedOrders.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await fetchOrders();
        };
        init();
    }, [fetchOrders]);

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatusBadge = ({ status, type }: { status: string, type: 'payment' | 'global' }) => {
        const isSuccess = status === 'paid' || status === 'delivered';
        const isError = status === 'failed' || status === 'cancelled';
        const isWarning = status === 'pending' || status === 'processing';
        
        return (
            <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">{type}</span>
                <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    isSuccess ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                    isError ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                    isWarning ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' :
                    'bg-blue-400/10 text-blue-400 border-blue-400/20'
                )}>
                    <div className={cn("w-1 h-1 rounded-full", 
                        isSuccess ? "bg-emerald-400 animate-pulse" : isError ? "bg-red-400" : isWarning ? "bg-orange-400" : "bg-blue-400"
                    )} />
                    {status}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Order Tracking</h2>
                    <p className="text-white/40 text-sm mt-1">Real-time monitoring of all platform transactions</p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Buyer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm text-white placeholder:text-white/20 transition-all backdrop-blur-xl"
                    />
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Order Ident</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Financials</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Tracking</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                                                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Accessing Logs...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-white/20">
                                                <AlertCircle className="w-12 h-12 stroke-1" />
                                                <p className="text-xs font-bold uppercase tracking-widest">No order records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <motion.tr 
                                            key={order.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-white/5 transition-all"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-accent">
                                                        <Hash className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-[10px] font-black text-white/40 uppercase tracking-tighter">
                                                            ID: {order.id.slice(-12).toUpperCase()}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-white/60 font-bold mt-0.5">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                                                                day: '2-digit', month: 'short', year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40 group-hover:text-accent transition-colors">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{order.buyerName}</div>
                                                        <div className="text-[10px] text-white/40 mt-0.5 font-black uppercase tracking-widest flex items-center gap-1">
                                                            <ShoppingBag className="w-3 h-3" />
                                                            {order.items.length} Product{order.items.length !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <div className="text-white font-black text-lg flex items-center gap-0.5">
                                                        <IndianRupee className="w-4 h-4 text-accent" />
                                                        {order.totalAmount}
                                                    </div>
                                                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                                                        Incl. ₹{order.deliveryTotal} Delivery
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-6">
                                                    <StatusBadge status={order.paymentStatus} type="payment" />
                                                    <div className="w-px h-8 bg-white/10" />
                                                    <StatusBadge status={order.status} type="global" />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
