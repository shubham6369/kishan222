import { NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

const cashfree = new Cashfree(
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, increment } from 'firebase/firestore';

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
      // 1. Activate User Registration
      try {
        const userQuery = query(collection(db, 'users'), where('paymentOrderId', '==', orderId));
        const userSnap = await getDocs(userQuery);
        
        if (!userSnap.empty) {
          const userDoc = userSnap.docs[0];
          const userData = userDoc.data();
          
          // If not already activated, activate the user and process outreach rewards
          if (!userData.membershipId) {
            const newMemberId = 'KSS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const normalizedPhone = userData.phone || '';
            
            await updateDoc(doc(db, 'users', userDoc.id), {
              membershipId: newMemberId,
              referralCode: newMemberId,
              membershipFeePaid: 50,
              paymentStatus: 'paid',
              paymentId: successfulPayment.cf_payment_id,
              updatedAt: new Date()
            });

            // Credit Outreach rewards to the referrer if present
            const referrerId = userData.referredBy;
            if (referrerId) {
              try {
                const usersRef = collection(db, 'users');
                const qRef = query(usersRef, where('membershipId', '==', referrerId));
                const referrerSnap = await getDocs(qRef);
                
                if (!referrerSnap.empty) {
                  const referrerDoc = referrerSnap.docs[0];
                  const referrerData = referrerDoc.data();
                  
                  const referrerPhone = (referrerData.phone || '').replace(/\D/g, '');
                  if (referrerPhone === normalizedPhone.replace(/\D/g, '')) {
                    console.warn('Server-side self-referral attempt blocked:', referrerId);
                  } else {
                    // Credit ₹7 to referrer
                    await updateDoc(doc(db, 'users', referrerDoc.id), {
                      'stats.totalReferrals': increment(1),
                      'stats.earnings': increment(7),
                      'walletBalance': increment(7)
                    });

                    // Record referral details under referrer's subcollection
                    const referralsRef = collection(db, 'users', referrerDoc.id, 'referrals');
                    await setDoc(doc(referralsRef, userDoc.id), {
                      referredUserId: userDoc.id,
                      referredUserName: userData.fullName || 'Unknown Farmer',
                      referredUserPhone: normalizedPhone,
                      joinedAt: new Date().toISOString(),
                      reward: 7,
                      paymentConfirmed: true,
                      paymentId: successfulPayment.cf_payment_id,
                    });
                  }
                }
              } catch (refErr) {
                console.error('Server-side outreach reward failed:', refErr);
              }
            }
          }
        }
      } catch (dbErr) {
        console.error('Server-side registration activation failed:', dbErr);
      }

      // 2. Update order in Firestore
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
