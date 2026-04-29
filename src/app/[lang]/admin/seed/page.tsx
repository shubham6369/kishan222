'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Sprout, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { seedProducts } from '@/lib/seed';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSeed = async () => {
    setIsSeeding(true);
    setError('');
    setIsSuccess(false);

    try {
      await seedProducts();
      setIsSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      const error = err as Error;
      setError(error.message || 'Seeding failed. Check console for details.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f5]">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5"
          >
            <div className="bg-[#122c1f] p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <Database className="w-8 h-8 text-secondary" />
                <h1 className="text-2xl font-serif font-bold">Samiti Database Control</h1>
              </div>
              <p className="text-white/70 text-sm">
                Use this utility to populate the marketplace with initial organic products and committee essentials.
              </p>
            </div>

            <div className="p-8 space-y-8">
              {!isSuccess ? (
                <>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4 text-amber-800 text-sm">
                    <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-bold mb-1">Attention Required</p>
                      <p>This action will add 3 premium mock products to your Firestore collection. Ensure your Firebase configuration is active.</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Products to be Added</h3>
                    <ul className="space-y-2">
                       {['Pure Sharbati Wheat', 'Raw Forest Honey', 'Organic Desi Ghee'].map((p) => (
                         <li key={p} className="flex items-center gap-3 text-[#122c1f] font-medium">
                           <Sprout className="w-4 h-4 text-green-600" />
                           {p}
                         </li>
                       ))}
                    </ul>
                  </div>

                  <button
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="w-full py-4 bg-[#122c1f] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSeeding ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        Begin Seeding Process
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center space-y-6 py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-[#122c1f]">Seeding Complete!</h2>
                    <p className="text-[#77574d] text-sm">The marketplace is now populated with premium heritage products.</p>
                  </div>
                  <div className="flex gap-4 justify-center pt-4">
                    <Link href="/marketplace" className="px-8 py-3 bg-[#122c1f] text-white rounded-xl font-bold hover:shadow-lg transition-all">
                      View Marketplace
                    </Link>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="px-8 py-3 border border-[#122c1f]/10 text-[#122c1f] rounded-xl font-bold hover:bg-[#122c1f]/5 transition-all"
                    >
                      Seed More
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
