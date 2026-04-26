'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

export default function CartPage({ params }: { params: { lang: string } }) {
  const { cart, removeFromCart, updateQuantity, subtotal, deliveryTotal, totalItems } = useCart();
  const { dict } = useLanguage();
  
  const grandTotal = subtotal + deliveryTotal;

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-[#122c1f] mb-8 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            {dict.cart.title}
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] border border-black/5 shadow-sm">
              <div className="w-20 h-20 bg-[#122c1f]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-[#122c1f]/20" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#122c1f] mb-4">{dict.cart.empty}</h2>
              <p className="text-[#77574d] mb-8">{dict.cart.empty_subtitle}</p>
              <Link 
                href={`/${params.lang}/marketplace`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#122c1f] text-white rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                {dict.cart.explore}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.productId}
                    className="p-4 bg-white rounded-3xl border border-black/5 flex flex-col sm:flex-row items-start sm:items-center gap-6"
                  >
                    <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-[#fbf9f5]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/${params.lang}/marketplace/${item.productId}`} className="hover:text-[#77574d]">
                          <h3 className="text-lg font-serif font-bold text-[#122c1f]">{item.name}</h3>
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#77574d] mb-4">
                        <span className="font-bold text-[#122c1f]">₹{item.price}</span>
                        <span>/ {item.weight}</span>
                        {item.deliveryCharge > 0 && (
                          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-[#122c1f]/5 rounded-md text-[#122c1f]">
                            + ₹{item.deliveryCharge} Delivery
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-[#fbf9f5] border border-black/5 rounded-xl p-1 h-10">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-full flex items-center justify-center text-[#122c1f] hover:bg-white rounded-lg transition-colors font-bold disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold font-mono text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-[#122c1f] hover:bg-white rounded-lg transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="font-serif font-bold text-[#122c1f] text-lg">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="p-8 bg-white rounded-[32px] border border-black/5 shadow-sm space-y-6 sticky top-24">
                  <h3 className="text-xl font-serif font-bold text-[#122c1f]">{dict.cart.summary}</h3>
                  
                  <div className="space-y-4 text-sm text-[#77574d]">
                    <div className="flex justify-between">
                      <span>{dict.cart.subtotal} ({totalItems} items)</span>
                      <span className="font-bold text-[#122c1f]">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{dict.cart.delivery}</span>
                      <p className="font-bold text-[#122c1f] uppercase tracking-tighter">
                        {deliveryTotal === 0 ? dict.cart.free : `₹${deliveryTotal}`}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-black/5 flex justify-between items-end">
                      <span className="font-bold text-[#122c1f]">{dict.cart.total}</span>
                      <span className="text-2xl font-serif font-bold text-[#122c1f]">₹{grandTotal}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/${params.lang}/checkout`}
                    className="w-full py-4 bg-[#122c1f] text-white rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl hover:shadow-[#122c1f]/20 hover:scale-[1.02] transition-all"
                  >
                    {dict.cart.proceed}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-[10px] text-[#77574d] mt-4 text-center">
                    {dict.cart.taxes_notice}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
