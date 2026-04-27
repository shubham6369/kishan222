'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, RefreshCcw, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function FailureContent({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <main className="flex-1 pt-40 pb-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-[#122c1f] mb-4">Payment Failed</h1>
        <p className="text-[#77574d] text-lg mb-10">
          Oops! Something went wrong with your transaction. Don't worry, if any amount was deducted, it will be refunded automatically.
        </p>

        <div className="bg-white rounded-[32px] border border-black/5 p-8 mb-10 text-left space-y-4 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-[#77574d]">Order Reference</span>
            <span className="font-bold text-[#122c1f] font-mono">{orderId || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-black/5 pt-4">
            <span className="text-[#77574d]">Status</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
              Failed
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => router.push(`/${params.lang}/checkout`)}
            className="flex-1 py-4 bg-[#122c1f] text-white rounded-2xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-[#122c1f]/20 hover:scale-[1.02] transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <button 
            onClick={() => router.push(`/${params.lang}/cart`)}
            className="flex-1 py-4 bg-white border border-black/10 text-[#122c1f] rounded-2xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-black/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
        </div>
      </div>
    </main>
  );
}

export default function PaymentFailurePage(props: { params: { lang: string } }) {
  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col">
      <Navbar />
      <Suspense fallback={
        <main className="flex-1 pt-40 pb-20 px-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#122c1f]" />
        </main>
      }>
        <FailureContent {...props} />
      </Suspense>
      <Footer />
    </div>
  );
}
