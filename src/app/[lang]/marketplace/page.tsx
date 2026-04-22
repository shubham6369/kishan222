'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/marketplace/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Leaf, Droplets, Sun, Wind } from 'lucide-react';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

const CATEGORIES = ['All', 'Grains', 'Dairy & Sweeteners', 'Oils', 'Spices', 'Seeds'];

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const productsRef = collection(db, 'products');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 bg-[#122c1f] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#77574d] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/10"
            >
              <Leaf className="w-4 h-4 text-green-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">100% Organic Marketplace</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold leading-tight"
            >
              Earth's Bounty, <br />
              <span className="text-[#fbf9f5]/60 italic font-medium">Direct to You.</span>
            </motion.h1>
            
            <div className="w-full max-w-2xl mt-10">
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fbf9f5]/40 group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search for organic produce, seeds, or farmers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-lg focus:bg-white/10 focus:ring-4 focus:ring-white/5 transition-all outline-none backdrop-blur-sm"
                    />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Filter Bar */}
      <section className="bg-white border-b border-black/3 sticky top-[80px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar w-full md:w-auto">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                            selectedCategory === cat 
                            ? 'bg-[#122c1f] text-white' 
                            : 'bg-[#fbf9f5] text-[#122c1f]/60 hover:bg-[#122c1f]/5'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <button className="flex items-center gap-2 px-6 py-2 bg-[#fbf9f5] border border-black/3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#122c1f]/60 hover:text-[#122c1f] transition-all">
                <Filter className="w-4 h-4" />
                Advanced Filters
            </button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77574d] mb-2 font-body">Current Season</p>
              <h2 className="text-4xl font-serif font-bold text-[#122c1f]">Featured Products</h2>
            </div>
            <p className="text-sm text-[#77574d] font-medium font-body">
              Showing <span className="text-[#122c1f] font-bold">{filteredProducts.length}</span> results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-[#122c1f]/5 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-[#122c1f]/20" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#122c1f]">No products found</h3>
                <p className="text-[#77574d]">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Sustainable Features */}
      <section className="py-20 bg-[#122c1f] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
            <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-xl font-serif font-bold">100% Organic</h4>
                <p className="text-sm opacity-60">Every product is verified organic through traditional and modern checks.</p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-xl font-serif font-bold">Pesticide Free</h4>
                <p className="text-sm opacity-60">No chemicals, just nature. Healthy soil, healthy soul.</p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Sun className="w-6 h-6 text-yellow-400" />
                </div>
                <h4 className="text-xl font-serif font-bold">Traceability</h4>
                <p className="text-sm opacity-60">Know exactly where your food comes from and the farmer behind it.</p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Wind className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-xl font-serif font-bold">Ethical Sourcing</h4>
                <p className="text-sm opacity-60">Fair pricing for farmers, ensuring sustainable rural development.</p>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
