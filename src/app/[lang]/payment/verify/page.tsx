'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PaymentVerifyPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push(`/${params.lang}/cart`);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/cashfree/verify-payment?order_id=${orderId}`);
        const data = await res.json();

        if (data.status === 'SUCCESS') {
          router.push(`/${params.lang}/payment/success?order_id=${orderId}&payment_id=${data.paymentId}`);
        } else {
          router.push(`/${params.lang}/payment/failure?order_id=${orderId}`);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Payment verification failed. Please check your dashboard.');
      }
    };

    verifyPayment();
  }, [orderId, params.lang, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-[#77574d] mb-8">{error}</p>
        <button 
          onClick={() => router.push(`/${params.lang}/dashboard`)}
          className="px-8 py-3 bg-[#122c1f] text-white rounded-xl font-bold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <Loader2 className="w-12 h-12 text-[#122c1f] animate-spin mb-6" />
      <h1 className="text-2xl font-serif font-bold text-[#122c1f]">Verifying Payment</h1>
      <p className="text-[#77574d] mt-2">Please do not refresh or close this window.</p>
    </div>
  );
}
