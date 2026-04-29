'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Order, CartItem } from '@/types';
import Image from 'next/image';

export default function BuyerPurchasesPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('buyerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-[#122c1f] font-serif">Loading your recent purchases...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Package className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#122c1f]">My Purchases</h1>
        <p className="text-[#77574d] text-sm mt-1">Track your orders and view past purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 bg-white rounded-[32px] border border-black/5 text-center">
          <Package className="w-12 h-12 text-[#122c1f]/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-[#122c1f]">No purchases yet</h3>
          <p className="text-[#77574d] mt-2 mb-6">Looks like you haven&apos;t bought anything from the marketplace.</p>
          <Link href="/en/marketplace" className="inline-block px-6 py-3 bg-[#122c1f] text-white rounded-xl font-bold uppercase tracking-widest text-xs">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 bg-white rounded-3xl border border-black/5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-black/5 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Order ID: {order.id}</p>
                  <p className="text-xs text-[#122c1f] font-medium mt-1">
                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#fbf9f5] rounded-xl border border-black/5">
                  {getStatusIcon(order.status)}
                  <span className="text-xs font-bold uppercase tracking-wide text-[#122c1f]">{order.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item: CartItem, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-[#fbf9f5]">
                        {item.image && (
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill
                            className="object-cover" 
                          />
                        )}
                      </div>
                      <span className="font-medium text-[#122c1f]">{item.quantity}x {item.name}</span>
                    </div>
                    <span className="text-[#77574d]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-black/5">
                <span className="text-sm font-bold text-[#122c1f]">Total Amount</span>
                <span className="text-xl font-serif font-bold text-[#122c1f]">₹{order.totalAmount}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
