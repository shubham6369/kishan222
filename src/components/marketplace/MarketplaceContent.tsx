'use client';

import React, { useState, useEffect } from 'react';
import { Dictionary } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';
import ProductCard from '@/components/marketplace/ProductCard';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Filter, Leaf } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/seed';

const MarketplaceFeatures = dynamic(() => import('@/components/marketplace/MarketplaceFeatures'), {
  loading: () => <div className="h-64 bg-[#122c1f] animate-pulse" />
});

interface MarketplaceContentProps {
  lang: string;
  dict: Dictionary;
}

export default function MarketplaceContent({ dict }: MarketplaceContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = [
    { id: 'all', label: dict.marketplace.categories.all },
    { id: 'seeds', label: dict.marketplace.categories.seeds },
    { id: 'grains', label: dict.marketplace.categories.grains },
    { id: 'fertilizers', label: dict.marketplace.categories.fertilizers },
    { id: 'pesticides', label: dict.marketplace.categories.pesticides },
    { id: 'machinery', label: dict.marketplace.categories.machinery },
    { id: 'cattle', label: dict.marketplace.categories.cattle },
    { id: 'fresh', label: dict.marketplace.categories.fresh },
  ];

  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const dbItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Combine with mock products and de-duplicate based on name and image
      const mockItems = MOCK_PRODUCTS.map((p, index) => ({
        id: `mock-${index}`,
        ...p
      })) as Product[];

      // Create a consolidated list
      const allItems = [...dbItems, ...mockItems];
      
      // De-duplicate based on name and image
      const uniqueItems: Product[] = [];
      const seen = new Set<string>();

      allItems.forEach(item => {
        // Create a unique key for name + image combination
        const key = `${item.name?.toLowerCase()}-${item.image}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueItems.push(item);
        }
      });

      setProducts(uniqueItems);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      // Fallback to mock products on error
      setProducts(MOCK_PRODUCTS.map((p, index) => ({ id: `mock-${index}`, ...p })) as Product[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'all' || p.category === selectedCategory) &&
    (p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 bg-[#122c1f] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#77574d] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/10"
            >
              <Leaf className="w-4 h-4 text-green-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{dict.marketplace.organic_label}</span>
            </m.div>
            
            <m.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6"
            >
              {dict.marketplace.title}
            </m.h1>
            <p className="text-white/70 text-xl leading-relaxed max-w-2xl">
              {dict.marketplace.subtitle}
            </p>
            
            <div className="w-full max-w-2xl mt-10">
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fbf9f5]/40 group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" 
                        placeholder={dict.marketplace.search_placeholder}
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
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                            selectedCategory === cat.id 
                            ? 'bg-[#122c1f] text-white' 
                            : 'bg-[#fbf9f5] text-[#122c1f]/60 hover:bg-[#122c1f]/5'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
            
            <button className="flex items-center gap-2 px-6 py-2 bg-[#fbf9f5] border border-black/3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#122c1f]/60 hover:text-[#122c1f] transition-all">
                <Filter className="w-4 h-4" />
                {dict.marketplace.filters}
            </button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77574d] mb-2 font-body">{dict.marketplace.season}</p>
              <h2 className="text-4xl font-serif font-bold text-[#122c1f]">{dict.marketplace.featured}</h2>
            </div>
            <p className="text-sm text-[#77574d] font-medium font-body">
              {dict.marketplace.showing} <span className="text-[#122c1f] font-bold">{filteredProducts.length}</span> {dict.marketplace.results}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
                {filteredProducts.map((product, index) => (
                    <m.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <ProductCard product={product} />
                    </m.div>
                ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-[#122c1f]/5 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-[#122c1f]/20" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#122c1f] mb-2">{dict.marketplace.no_results}</h3>
                <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="text-[#77574d] font-bold underline"
                >
                    {dict.marketplace.categories.all}
                </button>
            </div>
          )}
          
          {loading && (
            <div className="py-20 flex justify-center">
              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Sustainable Features */}
      <MarketplaceFeatures />
    </>
  );
}
