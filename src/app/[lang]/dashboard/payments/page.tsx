'use client';

import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { 
  CreditCard, CheckCircle2, XCircle, Clock, 
  Search, Filter, IndianRupee, ExternalLink, TrendingUp, Leaf
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
  createdAt: any;
  paymentId?: string;
  items?: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
} as const;

const PRODUCT_CATALOG_DATA = {
  seeds: [
    { name: 'Hybrid Paddy Seeds', price: 480, unit: '5kg', trend: 'up' },
    { name: 'Mustard Seeds (Varuna)', price: 420, unit: '2kg', trend: 'stable' },
    { name: 'Wheat Seeds (Sonalika)', price: 550, unit: '40kg', trend: 'down' },
    { name: 'Bt Cotton Seeds', price: 860, unit: '450g', trend: 'up' },
    { name: 'Sunflower Seeds', price: 750, unit: '1kg', trend: 'stable' }
  ],
  grains: [
    { name: 'Premium Basmati Rice', price: 120, unit: '1kg', trend: 'up' },
    { name: 'Organic Black Gram', price: 160, unit: '1kg', trend: 'stable' },
    { name: 'Organic Moong Dal', price: 180, unit: '1kg', trend: 'up' },
    { name: 'Organic Pearl Millet', price: 65, unit: '1kg', trend: 'down' },
    { name: 'Wheat Grain (Sharbati)', price: 45, unit: '1kg', trend: 'stable' }
  ],
  fertilizers: [
    { name: 'NPK Granular (19:19:19)', price: 1350, unit: '50kg', trend: 'stable' },
    { name: 'Vermicompost Organic', price: 280, unit: '25kg', trend: 'up' },
    { name: 'Bio-Fertilizer', price: 180, unit: '500ml', trend: 'stable' },
    { name: 'Urea (Nitrogen)', price: 300, unit: '45kg', trend: 'down' },
    { name: 'DAP Fertilizer', price: 1350, unit: '50kg', trend: 'stable' }
  ],
  pesticides: [
    { name: 'Neem Oil Bio-Pesticide', price: 320, unit: '1L', trend: 'up' },
    { name: 'Trichoderma Viride', price: 240, unit: '500g', trend: 'stable' },
    { name: 'Garlic-Pepper Spray', price: 210, unit: '500ml', trend: 'stable' },
    { name: 'Bio-Pest Control', price: 450, unit: '1L', trend: 'up' },
    { name: 'Organic Neem Cake', price: 180, unit: '5kg', trend: 'stable' }
  ],
  machinery: [
    { name: 'Battery Knapsack Sprayer', price: 2850, unit: '16L', trend: 'stable' },
    { name: 'Manual Seed Drill', price: 4500, unit: 'Unit', trend: 'down' },
    { name: 'Solar Water Pump', price: 45000, unit: 'Set', trend: 'stable' },
    { name: 'Electric Grass Cutter', price: 12500, unit: 'Unit', trend: 'up' },
    { name: 'Mini Power Tiller', price: 18500, unit: 'Unit', trend: 'stable' }
  ],
  cattle: [
    { name: 'Pure Desi Cow Ghee', price: 1250, unit: '1L', trend: 'up' },
    { name: 'Gau Ark (Distilled)', price: 150, unit: '500ml', trend: 'stable' },
    { name: 'Cow Dung Cake (Upla)', price: 120, unit: '24pcs', trend: 'stable' },
    { name: 'Cattle Feed (High Protein)', price: 1850, unit: '50kg', trend: 'up' },
    { name: 'Mineral Mixture', price: 240, unit: '1kg', trend: 'stable' }
  ],
  fresh: [
    { name: 'Organic Tomatoes', price: 45, unit: '1kg', trend: 'up' },
    { name: 'Organic Turmeric Finger', price: 220, unit: '1kg', trend: 'stable' },
    { name: 'Organic Potatoes', price: 35, unit: '1kg', trend: 'down' },
    { name: 'Organic Onions', price: 40, unit: '1kg', trend: 'up' },
    { name: 'Green Chillies', price: 80, unit: '1kg', trend: 'stable' }
  ]
} as const;

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
          paymentId: doc.data().paymentId,
          items: doc.data().items || []
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

  // Logic for Visual Analytics Chart
  const getMonthlyData = () => {
    const monthlyTotals = new Array(6).fill(0);
    const now = new Date();
    
    transactions.filter(t => t.paymentStatus === 'paid').forEach(t => {
      const date = t.createdAt?.toDate?.() || new Date(t.createdAt);
      const monthDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
      if (monthDiff >= 0 && monthDiff < 6) {
        monthlyTotals[5 - monthDiff] += t.amount;
      }
    });

    const max = Math.max(...monthlyTotals, 1);
    return monthlyTotals.map(total => ({
      total,
      height: (total / max) * 100
    }));
  };

  // Logic for Category Breakdown
  const getCategoryBreakdown = () => {
    const breakdown: Record<string, number> = {};
    let totalSpent = 0;

    transactions.filter(t => t.paymentStatus === 'paid').forEach(t => {
      t.items?.forEach(item => {
        const cat = item.category || 'Others';
        breakdown[cat] = (breakdown[cat] || 0) + (item.price * item.quantity);
        totalSpent += (item.price * item.quantity);
      });
    });

    const sorted = Object.entries(breakdown)
      .map(([label, amount]) => ({
        label: (dict.marketplace.categories as any)[label] || label.charAt(0).toUpperCase() + label.slice(1),
        amount: amount,
        percent: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
        color: label === 'seeds' ? 'bg-emerald-500' : 
               label === 'grains' ? 'bg-amber-500' :
               label === 'fertilizers' ? 'bg-sky-500' : 
               label === 'machinery' ? 'bg-rose-500' : 
               label === 'pesticides' ? 'bg-purple-500' :
               label === 'cattle' ? 'bg-indigo-500' :
               'bg-slate-400'
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return sorted.length > 0 ? sorted : [
      { label: dict.marketplace.categories.seeds, amount: 0, percent: 0, color: 'bg-emerald-500' },
      { label: dict.marketplace.categories.grains, amount: 0, percent: 0, color: 'bg-amber-500' },
      { label: dict.marketplace.categories.fertilizers, amount: 0, percent: 0, color: 'bg-sky-500' },
      { label: dict.marketplace.categories.machinery, amount: 0, percent: 0, color: 'bg-rose-500' },
      { label: dict.dashboard.payments_intel.others, amount: 0, percent: 0, color: 'bg-slate-400' }
    ];
  };

  const chartData = getMonthlyData();
  const categories = getCategoryBreakdown();
  
  // Mock Market Rates for the "Add Price" part of the request
  const marketRates = [
    { category: dict.marketplace.categories.seeds, avgPrice: '₹450 - ₹850', trend: '+2.4%', icon: <Leaf className="w-4 h-4" /> },
    { category: dict.marketplace.categories.grains, avgPrice: '₹40 - ₹180', trend: '-1.2%', icon: <TrendingUp className="w-4 h-4" /> },
    { category: dict.marketplace.categories.machinery, avgPrice: '₹1,800 - ₹45,000', trend: '+5.0%', icon: <Filter className="w-4 h-4" /> },
    { category: dict.marketplace.categories.fertilizers, avgPrice: '₹300 - ₹1,350', trend: dict.dashboard.payments_intel.stable, icon: <CreditCard className="w-4 h-4" /> },
  ];

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short' });
  });

  return (
    <m.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      <m.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#122c1f] tracking-tight">{dict.dashboard.payments_intel.title}</h1>
          <p className="text-[#77574d] mt-2 font-medium opacity-80">{dict.dashboard.payments_intel.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-black/5 shadow-sm">
          <div className="px-4 py-2 bg-[#122c1f] text-white rounded-xl text-xs font-bold uppercase tracking-widest">
            {dict.dashboard.payments_intel.live_updates}
          </div>
          <span className="text-[10px] font-bold text-[#77574d] pr-4 uppercase tracking-widest">{dict.dashboard.payments_intel.synced.replace('{time}', '2m')}</span>
        </div>
      </m.div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <m.div variants={itemVariants} className="bg-white p-8 rounded-[48px] border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-green-900/5 transition-all duration-500">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 blur-3xl -mr-20 -mt-20 group-hover:bg-green-500/10 transition-colors" />
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em]">Verified</span>
              <p className="text-sm font-bold text-[#122c1f]/40 mt-0.5">Successful Orders</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-5xl font-serif font-bold text-[#122c1f]">
              {transactions.filter(t => t.paymentStatus === 'paid').length}
            </p>
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">+12%</span>
              <span className="text-[10px] font-bold text-[#77574d]/50 mt-1 uppercase tracking-wider">vs Last Month</span>
            </div>
          </div>
        </m.div>

        <m.div variants={itemVariants} className="bg-white p-8 rounded-[48px] border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#122c1f]/5 transition-all duration-500">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#122c1f]/5 blur-3xl -mr-20 -mt-20 group-hover:bg-[#122c1f]/10 transition-colors" />
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-[#122c1f]/5 rounded-2xl flex items-center justify-center text-[#122c1f] shadow-inner">
              <IndianRupee className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#122c1f] uppercase tracking-[0.3em]">Total Value</span>
              <p className="text-sm font-bold text-[#122c1f]/40 mt-0.5">Lifetime Investment</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-5xl font-serif font-bold text-[#122c1f]">
              ₹{transactions.filter(t => t.paymentStatus === 'paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
            </p>
            <TrendingUp className="w-8 h-8 text-[#122c1f]/10 group-hover:text-[#122c1f]/30 transition-colors" />
          </div>
        </m.div>

        <m.div variants={itemVariants} className="bg-white p-8 rounded-[48px] border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-yellow-900/5 transition-all duration-500">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 blur-3xl -mr-20 -mt-20 group-hover:bg-yellow-500/10 transition-colors" />
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-700 shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em]">In Progress</span>
              <p className="text-sm font-bold text-[#122c1f]/40 mt-0.5">Processing Orders</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-5xl font-serif font-bold text-[#122c1f]">
              {transactions.filter(t => t.paymentStatus === 'pending').length}
            </p>
            <span className="text-xs font-black text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">Action Needed</span>
          </div>
        </m.div>
      </div>

      {/* Live Market Rates Section */}
      <m.div variants={itemVariants} className="bg-white rounded-[56px] border border-black/5 p-12 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.dashboard.payments_intel.market_rates}</h3>
            <p className="text-sm text-[#77574d]/60 font-medium font-body">{dict.dashboard.payments_intel.market_rates_subtitle}</p>
          </div>
          <div className="px-4 py-2 bg-[#fbf9f5] rounded-xl border border-black/5">
            <span className="text-[10px] font-black text-[#122c1f] uppercase tracking-widest">
              {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketRates.map((rate, i) => (
            <div key={i} className="p-6 bg-[#fbf9f5] rounded-3xl border border-black/5 hover:border-[#122c1f]/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#122c1f] shadow-sm group-hover:scale-110 transition-transform">
                  {rate.icon}
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${rate.trend.startsWith('+') ? 'bg-green-50 text-green-600' : rate.trend === 'Stable' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                  {rate.trend}
                </span>
              </div>
              <p className="text-xs font-bold text-[#77574d]/50 uppercase tracking-widest mb-1">{rate.category}</p>
              <p className="text-xl font-serif font-bold text-[#122c1f]">{rate.avgPrice}</p>
            </div>
          ))}
        </div>
      </m.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Analytics Block */}
        <m.div variants={itemVariants} className="lg:col-span-2 bg-[#122c1f] rounded-[56px] p-12 text-white relative overflow-hidden flex flex-col justify-between min-h-[500px] shadow-2xl shadow-green-900/20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#77574d]/10 blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 blur-[100px] -ml-48 -mb-48" />
          
          <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-start justify-between">
            <div className="space-y-8">
              <div>
                <h3 className="text-4xl font-serif font-bold italic mb-4">{dict.dashboard.payments_intel.market_velocity}</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm font-medium">
                  {dict.dashboard.payments_intel.market_velocity_desc}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col">
                  <span className="text-4xl font-serif font-bold">₹{(transactions.filter(t => t.paymentStatus === 'paid').reduce((acc, curr) => acc + curr.amount, 0) / 1000).toFixed(1)}k</span>
                  <span className="text-[10px] uppercase font-black opacity-40 tracking-[0.3em] mt-1">{dict.dashboard.payments_intel.total_payout}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-serif font-bold">₹{Math.round(transactions.filter(t => t.paymentStatus === 'paid').reduce((acc, curr) => acc + curr.amount, 0) / (transactions.filter(t => t.paymentStatus === 'paid').length || 1)).toLocaleString()}</span>
                  <span className="text-[10px] uppercase font-black opacity-40 tracking-[0.3em] mt-1">{dict.dashboard.payments_intel.avg_ticket}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full flex items-end justify-between gap-6 h-64 px-2">
              {chartData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-5 group cursor-pointer">
                  <div className="relative w-full flex flex-col items-center justify-end h-full">
                    <m.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${data.height}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full max-w-[56px] bg-white/5 rounded-t-[20px] group-hover:bg-white/20 transition-all relative overflow-hidden backdrop-blur-sm border border-white/5"
                    >
                      <m.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1), duration: 1 }}
                        className="absolute inset-0 bg-linear-to-t from-white/10 to-white/30"
                      />
                    </m.div>
                    {data.total > 0 && (
                      <span className="absolute -top-10 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-white text-[#122c1f] px-3 py-1.5 rounded-xl shadow-xl">
                        ₹{Math.round(data.total/1000)}k
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-black opacity-30 uppercase tracking-[0.3em] group-hover:opacity-100 transition-opacity">{last6Months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 mt-12 border-t border-white/5 flex items-center justify-between">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#122c1f] bg-[#fbf9f5] flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#122c1f] bg-white/10 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold">
                +12
              </div>
            </div>
            <p className="text-xs font-medium text-white/40 italic">You are among the top 15% active investors this month.</p>
          </div>
        </m.div>

        {/* Category Breakdown */}
        <m.div variants={itemVariants} className="bg-white rounded-[56px] border border-black/5 p-12 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.dashboard.payments_intel.capital_allocation}</h3>
            <div className="p-3 bg-[#fbf9f5] rounded-2xl group-hover:scale-110 transition-transform">
              <Filter className="w-5 h-5 text-[#122c1f]/40" />
            </div>
          </div>
          
          <div className="space-y-10">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-[#122c1f] tracking-tight">{cat.label}</span>
                    <span className="text-[10px] font-bold text-[#77574d]/50 uppercase tracking-widest mt-0.5">{Math.round(cat.percent)}% of total</span>
                  </div>
                  <span className="text-lg font-serif font-bold text-[#122c1f]">₹{cat.amount.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-[#fbf9f5] rounded-full overflow-hidden shadow-inner">
                  <m.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percent}%` }}
                    transition={{ delay: 1 + (i * 0.1), duration: 1.5, ease: "circOut" }}
                    className={`h-full ${cat.color} rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)]`} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-14 p-8 bg-[#122c1f] rounded-[40px] border border-white/5 relative overflow-hidden group/card">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl -mr-12 -mt-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{dict.dashboard.payments_intel.ai_prediction}</p>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                {transactions.length > 0 ? 
                  dict.dashboard.payments_intel.prediction_msg.replace('{category}', categories[0]?.label.toLowerCase() || 'farming') :
                  dict.dashboard.payments_intel.prediction_none
                }
              </p>
            </div>
          </div>
        </m.div>
      </div>

      {/* Product Catalog Section */}
      <m.div variants={itemVariants} className="bg-white rounded-[56px] border border-black/5 p-12 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div className="space-y-1">
            <h3 className="text-3xl font-serif font-bold text-[#122c1f]">{dict.dashboard.payments_intel.product_catalog}</h3>
            <p className="text-sm text-[#77574d]/60 font-medium font-body">{dict.dashboard.payments_intel.product_catalog_subtitle}</p>
          </div>
          <a href={`/${lang}/marketplace`} className="inline-flex items-center gap-2 px-6 py-3 bg-[#fbf9f5] text-[#122c1f] rounded-2xl text-xs font-black uppercase tracking-widest border border-black/5 hover:bg-[#122c1f] hover:text-white transition-all group">
            {dict.dashboard.payments_intel.view_all_products}
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {Object.entries(dict.marketplace.categories).filter(([key]) => key !== 'all').map(([key, label]) => {
            const categoryData = PRODUCT_CATALOG_DATA[key as keyof typeof PRODUCT_CATALOG_DATA] || [];

            return (
              <div key={key} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-6 rounded-full ${
                    key === 'seeds' ? 'bg-emerald-500' : 
                    key === 'grains' ? 'bg-amber-500' :
                    key === 'fertilizers' ? 'bg-sky-500' : 
                    key === 'machinery' ? 'bg-rose-500' : 
                    key === 'pesticides' ? 'bg-purple-500' :
                    key === 'cattle' ? 'bg-indigo-500' :
                    'bg-slate-400'
                  }`} />
                  <h4 className="text-sm font-black text-[#122c1f] uppercase tracking-widest">{label}</h4>
                </div>
                <div className="space-y-3">
                  {categoryData.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#fbf9f5] rounded-2xl border border-black/5 hover:border-[#122c1f]/10 transition-all group cursor-default">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#122c1f] leading-tight group-hover:text-[#122c1f] transition-colors">{p.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium text-[#77574d]/50">{p.unit}</span>
                          {p.trend === 'up' && <span className="text-[10px] font-bold text-emerald-600">↑</span>}
                          {p.trend === 'down' && <span className="text-[10px] font-bold text-rose-600">↓</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-[#122c1f]">₹{p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </m.div>

      {/* Transactions Table */}
      <m.div variants={itemVariants} className="bg-white rounded-[48px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-black/5 flex flex-col xl:flex-row gap-8 justify-between items-center bg-[#fbf9f5]/30">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-[#122c1f]">{dict.dashboard.payments_intel.ledger_title}</h3>
            <p className="text-sm text-[#77574d]/60 font-medium">{dict.dashboard.payments_intel.ledger_subtitle}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77574d]/30" />
              <input 
                type="text" 
                placeholder="Search Order ID, Payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#122c1f]/5 outline-none transition-all border border-black/5"
              />
            </div>
            <button className="flex items-center justify-center gap-3 px-8 py-4 bg-[#122c1f] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#1c3f2d] transition-all shadow-lg shadow-green-900/10">
              <Filter className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-[#77574d]/40">
                <th className="px-8 py-2">Transaction Details</th>
                <th className="px-8 py-2">Amount</th>
                <th className="px-8 py-2">Date</th>
                <th className="px-8 py-2">Verification</th>
                <th className="px-8 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-[#122c1f]/10 border-t-[#122c1f] rounded-full animate-spin" />
                        <Clock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#122c1f]/20" />
                      </div>
                      <p className="text-sm font-black text-[#122c1f]/40 uppercase tracking-widest">{dict.dashboard.payments_intel.compiling}</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-[#fbf9f5] rounded-[32px] flex items-center justify-center shadow-inner">
                        <CreditCard className="w-10 h-10 text-[#122c1f]/10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-serif font-bold text-[#122c1f]">{dict.dashboard.payments_intel.ledger_no_tx}</p>
                        <p className="text-sm text-[#77574d]/60">{dict.dashboard.payments_intel.ledger_no_tx_desc}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="group">
                    <td className="px-8 py-6 bg-white border border-black/5 group-hover:border-[#122c1f]/20 group-hover:shadow-lg group-hover:shadow-black/5 rounded-l-[32px] transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#fbf9f5] rounded-2xl flex items-center justify-center group-hover:bg-[#122c1f]/5 transition-colors">
                          <CreditCard className="w-5 h-5 text-[#122c1f]/30 group-hover:text-[#122c1f] transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-[#122c1f] text-sm tracking-tight">{dict.dashboard.payments_intel.order_id}{t.orderId.slice(-8).toUpperCase()}</span>
                          <span className="text-[10px] font-bold text-[#77574d]/40 mt-0.5 tracking-wider uppercase">
                            {dict.dashboard.payments_intel.items_count_label.replace('{count}', (t.items?.length || 0).toString())} • {(dict.marketplace.categories as any)[t.items?.[0]?.category || 'others'] || t.items?.[0]?.category || dict.dashboard.payments_intel.others}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 bg-white border-y border-black/5 group-hover:border-[#122c1f]/20 group-hover:shadow-lg group-hover:shadow-black/5 transition-all">
                      <div className="flex items-center gap-1.5 font-serif font-bold text-xl text-[#122c1f]">
                        <span className="text-xs mt-1 text-[#77574d]/40 font-sans">₹</span>
                        {t.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 bg-white border-y border-black/5 group-hover:border-[#122c1f]/20 group-hover:shadow-lg group-hover:shadow-black/5 transition-all">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#122c1f]">
                          {t.createdAt?.toDate?.()?.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
                            day: 'numeric',
                            month: 'short'
                          }) || 'N/A'}
                        </span>
                        <span className="text-[10px] font-bold text-[#77574d]/40 mt-0.5">
                          {t.createdAt?.toDate?.()?.toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 bg-white border-y border-black/5 group-hover:border-[#122c1f]/20 group-hover:shadow-lg group-hover:shadow-black/5 transition-all">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        t.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' :
                        t.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          t.paymentStatus === 'paid' ? 'bg-green-600' :
                          t.paymentStatus === 'failed' ? 'bg-red-600' :
                          'bg-yellow-600 animate-pulse'
                        }`} />
                        {t.paymentStatus === 'paid' ? dict.dashboard.payments_intel.status_paid :
                         t.paymentStatus === 'failed' ? dict.dashboard.payments_intel.status_failed :
                         dict.dashboard.payments_intel.status_pending}
                      </div>
                    </td>
                    <td className="px-8 py-6 bg-white border border-black/5 border-l-0 group-hover:border-[#122c1f]/20 group-hover:shadow-lg group-hover:shadow-black/5 rounded-r-[32px] text-right transition-all">
                      <button className="p-3 bg-[#fbf9f5] text-[#122c1f]/40 hover:text-[#122c1f] hover:bg-[#122c1f]/5 rounded-xl transition-all">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </m.div>
    </m.div>
  );
}
