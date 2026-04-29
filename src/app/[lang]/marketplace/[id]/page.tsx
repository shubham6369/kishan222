'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  ShoppingCart,
  Truck, 
  RotateCcw,
  ChevronRight,
  CheckCheck
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Product {
    id: string;
    name: string;
    price: number;
    category?: string;
    rating?: number;
    reviews?: number;
    stock?: number;
    unit?: string;
    description?: string;
    image?: string;
    images?: string[];
    sellerId?: string;
    sellerName?: string;
    sellerLocation?: string;
    sellerPhoto?: string;
    isOrganic?: boolean;
    deliveryCharge?: number;
}

export default function ProductDetailsPage({ params }: { params: { id: string, lang: string } }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, 'products', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center">
        <div className="text-[#122c1f] font-serif animate-pulse">Loading Product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-serif text-[#122c1f]">Product Not Found</h1>
        <Link href={`/${params.lang}/marketplace`} className="text-[#77574d] hover:underline">Return to Marketplace</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || product.image || '/placeholder.png',
      sellerId: product.sellerId || '',
      deliveryCharge: product.deliveryCharge || 0,
      weight: product.unit || '1'
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = product.images || [product.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop'];
  const displayImage = images[0];
  const farmerName = product.sellerName || 'Verified Farmer';

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#77574d]/50 mb-8">
                <Link href={`/${params.lang}/marketplace`} className="hover:text-[#122c1f]">Marketplace</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#122c1f]">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Visuals Column */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="relative aspect-4/5 rounded-[40px] overflow-hidden shadow-2xl bg-white border border-black/5">
                        <Image 
                            src={displayImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        {product.isOrganic !== false && (
                            <div className="absolute top-8 left-8 bg-[#122c1f] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                Certified Organic
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                        {images.slice(0, 3).map((img: string, i: number) => (
                            <div key={i} className="aspect-square rounded-3xl bg-white border border-black/5 relative overflow-hidden group cursor-pointer">
                                <Image 
                                    src={img}
                                    alt="Thumbnail"
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Content Column */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-4 py-1 rounded-full bg-[#122c1f]/5 text-[#122c1f] text-[10px] font-bold uppercase tracking-widest border border-[#122c1f]/10">
                            {product.category || 'Produce'}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-[#122c1f]">{product.rating || '5.0'}</span>
                            <span className="text-xs text-[#77574d]/60 font-medium">({product.reviews || 0} Reviews)</span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#122c1f] leading-tight mb-2">
                        {product.name}
                    </h1>

                    <p className="text-[#77574d] text-sm mb-6">
                        {product.stock !== undefined ? (product.stock > 0 ? `${product.stock} units available` : 'Out of Stock') : ''}
                    </p>

                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-4xl font-serif font-bold text-[#122c1f]">₹{product.price}</span>
                        <span className="text-lg text-[#77574d]/60 font-medium">/ {product.unit || 'Item'}</span>
                    </div>

                    <div className="p-8 bg-white rounded-[32px] border border-black/5 space-y-6 mb-8">
                        <p className="text-[#77574d] leading-relaxed">
                            {product.description || 'Premium quality organic produce brought straight from the farm to your doorstep.'}
                        </p>
                    </div>

                    {/* Farmer Profile Mini */}
                    <div className="p-6 bg-[#122c1f]/5 rounded-3xl border border-[#122c1f]/5 flex items-center gap-6 mb-12">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-[#122c1f]/10 flex items-center justify-center text-[#122c1f] font-serif text-2xl font-bold">
                           {product.sellerPhoto ? (
                               <Image src={product.sellerPhoto} alt={farmerName} fill className="object-cover" />
                           ) : (
                               farmerName.charAt(0)
                           )}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-[#77574d] uppercase tracking-widest mb-1">Grown By</p>
                            <h4 className="font-serif font-bold text-[#122c1f]">{farmerName}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-[10px] font-medium text-[#77574d]">
                                    <MapPin className="w-3 h-3" /> {product.sellerLocation || 'Local Farm'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Controls */}
                    <div className="mt-auto space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center bg-white border border-black/5 rounded-2xl p-2 h-16">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-full flex items-center justify-center text-[#122c1f] hover:bg-[#fbf9f5] rounded-xl transition-colors font-bold"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-bold font-mono">{quantity}</span>
                                <button 
                                    onClick={() => {
                                        if (product.stock === undefined || quantity < product.stock) {
                                            setQuantity(quantity + 1)
                                        }
                                    }}
                                    className="w-12 h-full flex items-center justify-center text-[#122c1f] hover:bg-[#fbf9f5] rounded-xl transition-colors font-bold"
                                >
                                    +
                                </button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-1 ${added ? 'bg-green-500' : 'bg-[#122c1f]'} text-white h-16 rounded-[20px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:shadow-[#122c1f]/20 transition-all hover:scale-[1.02] ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {added ? <CheckCheck className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                                {added ? 'Added to Basket' : (product.stock === 0 ? 'Out of Stock' : 'Add to Basket')}
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/5">
                            <div className="flex items-center gap-3">
                                <Truck className="w-5 h-5 text-[#77574d]" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-[#122c1f]">Delivery</p>
                                    <p className="text-[10px] text-[#77574d]">
                                        {product.deliveryCharge ? `₹${product.deliveryCharge} within 2-3 days` : 'Free Delivery'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <RotateCcw className="w-5 h-5 text-[#77574d]" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-[#122c1f]">Easy Returns</p>
                                    <p className="text-[10px] text-[#77574d]">7 days money back</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
