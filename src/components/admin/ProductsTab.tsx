'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, CheckCircle, XCircle, User, Tag, Box, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProductsTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const fetchedProducts: Product[] = [];
            querySnapshot.forEach((doc) => {
                fetchedProducts.push({
                    id: doc.id,
                    ...doc.data()
                } as Product);
            });
            setProducts(fetchedProducts.reverse());
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await fetchProducts();
        };
        init();
    }, [fetchProducts]);

    const updateStatus = async (productId: string, status: 'approved' | 'rejected') => {
        setProcessing(productId);
        try {
            await updateDoc(doc(db, 'products', productId), { status });
            setProducts(products.map(p => p.id === productId ? { ...p, status } : p));
            toast.success(`Product ${status}`);
        } catch (error) {
            console.error("Error updating product status:", error);
            toast.error("Failed to update status");
        } finally {
            setProcessing(null);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatusBadge = ({ status }: { status?: string }) => {
        const s = status || 'pending';
        return (
            <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                s === 'approved' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                s === 'rejected' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                'bg-orange-400/10 text-orange-400 border-orange-400/20'
            )}>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                    s === 'approved' ? "bg-emerald-400" : s === 'rejected' ? "bg-red-400" : "bg-orange-400"
                )} />
                {s}
            </span>
        );
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-white">Marketplace Inventory</h2>
                    <p className="text-white/40 text-sm mt-1">Review and approve product listings from farmers</p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products or sellers..."
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
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Product Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Seller</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Pricing & Stock</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                                                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Scanning Warehouse...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-white/20">
                                                <AlertCircle className="w-12 h-12 stroke-1" />
                                                <p className="text-xs font-bold uppercase tracking-widest">No matching artifacts found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <motion.tr 
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-white/5 transition-all"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden shrink-0 relative border border-white/10 group-hover:border-accent/40 transition-colors">
                                                        <Image 
                                                            src={product.image || 'https://placehold.co/100x100?text=Product'} 
                                                            alt={product.name} 
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm line-clamp-1">{product.name}</div>
                                                        <div className="text-[10px] text-white/40 line-clamp-2 max-w-[250px] mt-1 font-medium">{product.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-white/60 text-xs font-bold">
                                                    <User className="w-3.5 h-3.5 text-accent" />
                                                    {product.sellerName}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-accent font-black text-lg flex items-center gap-1">
                                                    <Tag className="w-4 h-4" />
                                                    ₹{product.price}
                                                </div>
                                                <div className="text-[10px] text-white/40 mt-1 font-black uppercase tracking-widest flex items-center gap-1.5">
                                                    <Box className="w-3 h-3" />
                                                    {product.stock} Units
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <StatusBadge status={product.status} />
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    {product.status !== 'approved' && (
                                                        <button 
                                                            onClick={() => updateStatus(product.id, 'approved')} 
                                                            disabled={processing === product.id}
                                                            className="p-3 bg-emerald-400/10 text-emerald-400 rounded-2xl hover:bg-emerald-400 hover:text-primary transition-all shadow-lg shadow-emerald-400/10" 
                                                            title="Approve Listing"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {product.status !== 'rejected' && (
                                                        <button 
                                                            onClick={() => updateStatus(product.id, 'rejected')} 
                                                            disabled={processing === product.id}
                                                            className="p-3 bg-red-400/10 text-red-400 rounded-2xl hover:bg-red-400 hover:text-white transition-all shadow-lg shadow-red-400/10" 
                                                            title="Reject Listing"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
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
