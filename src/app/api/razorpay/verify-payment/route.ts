import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing verification fields' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay Key Secret is not configured' }, { status: 500 });
    }

    // Verify the payment signature

    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ status: 'FAILED', error: 'Invalid payment signature' }, { status: 400 });
    }

    // Signature verified!
    // 1. Activate User Registration
    try {
      const userQuery = query(collection(db, 'users'), where('paymentOrderId', '==', razorpay_order_id));
      const userSnap = await getDocs(userQuery);
      
      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        const userData = userDoc.data();
        
        // If not already activated, activate the user and process outreach rewards
        if (!userData.membershipId) {
          const newMemberId = 'KSS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
          await updateDoc(doc(db, 'users', userDoc.id), {
            membershipId: newMemberId,
            membershipFeePaid: 50,
            paymentStatus: 'paid',
            paymentId: razorpay_payment_id,
            updatedAt: new Date()
          });
        }
      }
    } catch (dbErr) {
      console.error('Server-side registration activation failed:', dbErr);
    }

    // 2. Try to update any order record in Firestore if it exists (matching Cashfree's behavior)
    try {
      const q = query(collection(db, 'orders'), where('orderId', '==', razorpay_order_id));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const orderDoc = snap.docs[0];
        await updateDoc(doc(db, 'orders', orderDoc.id), {
          paymentStatus: 'paid',
          paymentId: razorpay_payment_id,
          updatedAt: new Date()
        });
      }
    } catch (dbErr) {
      console.warn('Optional Firestore order update failed:', dbErr);
    }

    return NextResponse.json({ 
      status: 'SUCCESS',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

  } catch (error: unknown) {
    console.error('Error verifying Razorpay payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error verifying payment';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
