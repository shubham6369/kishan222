'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowRight, ShieldCheck, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const displayImage = product.images?.[0] || product.image || '/placeholder.png';
  const displayFarmer = product.sellerName || product.farmer || 'Farmer';
  const displayRating = product.rating || 5.0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation if wrapped
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: displayImage,
      sellerId: product.sellerId || '',
      deliveryCharge: product.deliveryCharge || 0,
      weight: product.unit || '1'
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(18,44,31,0.08)] flex flex-col h-full border border-black/3"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#fbf9f5]">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isOrganic && (
            <div className="bg-[#122c1f] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
              <ShieldCheck className="w-3 h-3" />
              Organic Certified
            </div>
          )}
        </div>
        
        {/* Quick Add Button */}
        <motion.button
          onClick={handleAddToCart}
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.1 }}
          animate={{ opacity: 1, y: 0 }}
          disabled={product.stock === 0}
          className={`absolute bottom-4 right-4 ${added ? 'bg-green-500 text-white' : 'bg-white text-[#122c1f] hover:bg-[#122c1f] hover:text-white'} p-3 rounded-xl shadow-xl transition-colors z-20 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {added ? <CheckCheck className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-widest text-[#77574d] font-bold">
            {product.category || 'Uncategorized'}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold text-[#122c1f]">{displayRating}</span>
          </div>
        </div>

        <Link href={`/marketplace/${product.id}`} className="group-hover:text-[#77574d] transition-colors">
          <h3 className="text-xl font-serif font-bold text-[#122c1f] mb-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs text-[#77574d]/60 mb-2 flex items-center gap-1">
          by <span className="text-[#122c1f] font-semibold">{displayFarmer}</span>
        </p>

        {product.stock !== undefined && (
          <p className="text-[10px] text-[#77574d] mb-4">
             {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
             {product.deliveryCharge ? ` • ₹${product.deliveryCharge} delivery` : ' • Free delivery'}
          </p>
        )}

        <div className="mt-auto flex justify-between items-end">
          <div>
            <p className="text-[10px] text-[#77574d] uppercase font-bold tracking-tight">Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif font-bold text-[#122c1f]">₹{product.price}</span>
              <span className="text-xs text-[#77574d]/60 font-medium">/ {product.unit || 'unit'}</span>
            </div>
          </div>
          
          <Link 
            href={`/marketplace/${product.id}`}
            className="text-[10px] uppercase font-bold tracking-widest text-[#122c1f] flex items-center gap-2 group/btn"
          >
            Details
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
