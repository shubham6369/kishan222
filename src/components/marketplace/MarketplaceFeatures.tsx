'use client';

import React from 'react';
import { Leaf, Droplets, Sun, Wind } from 'lucide-react';

export default function MarketplaceFeatures() {
  return (
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
  );
}
