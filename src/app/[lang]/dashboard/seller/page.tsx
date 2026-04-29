'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  ShoppingBag, TrendingUp, Package, Plus,
  ChevronRight, AlertCircle, BarChart3, ArrowUpRight,
  Eye, Trash2, ToggleLeft, ToggleRight, IndianRupee
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection, query, where, getDocs, doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  totalSold?: number;
  rating?: number;
  createdAt?: { toMillis: () => number };
}

interface OrderSummary {
  id: string;
  status: string;
  total: number;
  buyerName: string;
  createdAt?: { toMillis: () => number; toDate: () => Date };
}

const CARD = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-3xl border border-black/5 shadow-sm p-6 ${className}`}>{children}</div>
);

export default function SellerDashboard() {
  const { user, userData, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || 'en';

  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerData = useCallback(async () => {
    if (!user) return;
    try {
      // Fetch products
      const pQuery = query(
        collection(db, 'products'),
        where('sellerId', '==', user.uid)
      );
      const pSnap = await getDocs(pQuery);
      const prods = pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(prods);

      // Fetch recent orders (where this seller is involved)
      const oQuery = query(
        collection(db, 'orders'),
        where('sellerIds', 'array-contains', user.uid)
      );
      const oSnap = await getDocs(oQuery);
      const orders = oSnap.docs
        .map(d => ({ id: d.id, ...d.data() } as OrderSummary))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
        .slice(0, 5);
      setRecentOrders(orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) { router.push(`/${lang}/login`); return; }
    if (user) {
      const init = async () => {
        await fetchSellerData();
      };
      init();
    }
  }, [user, authLoading, fetchSellerData, lang, router]);

  const toggleProduct = async (product: Product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { isActive: !product.isActive });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isActive: !p.isActive } : p));
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'}.`);
    } catch {
      toast.error('Failed to update product status.');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted.');
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const totalRevenue = recentOrders.reduce((s, o) => s + (o.total || 0), 0);
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Listings', value: activeProducts, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Out of Stock', value: outOfStock, icon: AlertCircle, color: 'bg-red-50 text-red-600' },
    { label: 'Recent Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: IndianRupee, color: 'bg-orange-50 text-orange-600' },
  ];

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-[#122c1f]/20 border-t-[#122c1f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#122c1f]">Seller Dashboard</h1>
          <p className="text-[#77574d] mt-1">
            Welcome back, <span className="font-bold">{userData?.fullName?.split(' ')[0]}</span>. 
            Manage your listings and track sales.
          </p>
        </div>
        <Link
          href={`/${lang}/dashboard/products/new`}
          className="flex items-center gap-2 px-6 py-3 bg-[#122c1f] text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[#122c1f]/20"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <CARD>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color} mb-4`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#122c1f]">{s.value}</p>
              <p className="text-xs text-[#77574d] mt-1 font-medium">{s.label}</p>
            </CARD>
          </motion.div>
        ))}
      </div>

      {/* Products Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif font-bold text-[#122c1f]">My Products</h2>
          <Link href={`/${lang}/dashboard/orders`}
            className="text-sm font-bold text-[#77574d] flex items-center gap-1 hover:text-[#122c1f] transition-colors"
          >
            View All Orders <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <CARD className="text-center py-14">
            <ShoppingBag className="w-12 h-12 text-[#122c1f]/20 mx-auto mb-4" />
            <p className="font-bold text-[#122c1f] mb-1">No products yet</p>
            <p className="text-sm text-[#77574d] mb-6">Start selling your organic produce — list your first product!</p>
            <Link href={`/${lang}/dashboard/products/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#122c1f] text-white rounded-xl font-bold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </CARD>
        ) : (
          <div className="bg-white rounded-[28px] border border-black/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#122c1f]/3 border-b border-black/5">
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/3">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-[#fbf9f5] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <Image 
                              src={product.imageUrl} 
                              alt={product.name} 
                              width={40} 
                              height={40} 
                              className="w-10 h-10 rounded-xl object-cover" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-[#122c1f]/5 flex items-center justify-center">
                              <Package className="w-5 h-5 text-[#77574d]" />
                            </div>
                          )}
                          <span className="font-bold text-[#122c1f] line-clamp-1">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#77574d]">{product.category || '—'}</td>
                      <td className="px-6 py-4 font-bold text-[#122c1f]">₹{product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                          product.stock === 0 ? 'bg-red-100 text-red-700' :
                          product.stock < 10 ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleProduct(product)}
                          className={`flex items-center gap-1.5 text-xs font-bold ${product.isActive ? 'text-green-600' : 'text-[#77574d]'}`}
                        >
                          {product.isActive
                            ? <ToggleRight className="w-5 h-5 text-green-500" />
                            : <ToggleLeft className="w-5 h-5" />}
                          {product.isActive ? 'Live' : 'Paused'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/${lang}/marketplace/${product.id}`}
                            className="p-1.5 text-[#77574d] hover:text-[#122c1f] rounded-lg hover:bg-[#122c1f]/5 transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-[#122c1f]">Recent Orders</h2>
          <Link href={`/${lang}/dashboard/orders`}
            className="text-sm font-bold text-[#77574d] flex items-center gap-1 hover:text-[#122c1f] transition-colors"
          >
            Manage Orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <CARD className="text-center py-10">
            <BarChart3 className="w-10 h-10 text-[#122c1f]/20 mx-auto mb-3" />
            <p className="text-[#77574d] text-sm">No orders yet. Share your products to start selling!</p>
          </CARD>
        ) : (
          <div className="bg-white rounded-[28px] border border-black/5 shadow-sm overflow-hidden divide-y divide-black/5">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-bold text-[#122c1f] text-sm">{order.buyerName || 'Customer'}</p>
                  <p className="text-xs text-[#77574d] mt-0.5">
                    {order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short'
                    }) || 'Recent'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#122c1f]">₹{order.total || '—'}</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
