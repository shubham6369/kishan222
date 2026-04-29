import { NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

const cashfree = new Cashfree(
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const payments = response.data;
    
    interface CashfreePayment {
      payment_status: string;
      cf_payment_id: string;
    }
    
    // Check if any payment is successful
    const successfulPayment = (payments as unknown as CashfreePayment[]).find((p) => p.payment_status === 'SUCCESS');

    if (successfulPayment) {
      // Update order in Firestore
      const q = query(collection(db, 'orders'), where('orderId', '==', orderId));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const orderDoc = snap.docs[0];
        await updateDoc(doc(db, 'orders', orderDoc.id), {
          paymentStatus: 'paid',
          paymentId: successfulPayment.cf_payment_id,
          updatedAt: new Date()
        });
      }

      return NextResponse.json({ 
        status: 'SUCCESS',
        paymentId: successfulPayment.cf_payment_id,
        orderId: orderId
      });
    } else {
      return NextResponse.json({ 
        status: 'FAILED',
        message: 'No successful payment found'
      });
    }

  } catch (error: unknown) {
    console.error('Error fetching Cashfree payments:', error);
    return NextResponse.json({ error: 'Error verifying payment' }, { status: 500 });
  }
}
