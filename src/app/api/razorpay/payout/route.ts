import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { userId, upiId, amount } = await req.json();

    if (!userId || !upiId || !amount) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Initialize Razorpay credentials
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const accountNumber = process.env.RAZORPAYX_ACCOUNT_NUMBER;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys are not configured on the server' }, { status: 500 });
    }

    if (!accountNumber) {
      return NextResponse.json({ 
        error: 'RazorpayX Business Account Number (RAZORPAYX_ACCOUNT_NUMBER) is not configured in environment variables.' 
      }, { status: 500 });
    }

    // Securely retrieve the user's wallet balance from Firestore
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const currentBalance = Number(userData.walletBalance || 0);

    // Validate balance
    if (currentBalance < numericAmount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // Call Razorpay Payouts API
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    // Razorpay requires contact details to create a fund account. We'll use user's profile info.
    const userName = userData.fullName || 'Farmer Member';
    const userPhone = userData.phone || '9876543210';

    const razorpayPayload = {
      account_number: accountNumber,
      fund_account: {
        account_type: 'vpa',
        vpa: {
          address: upiId.trim()
        },
        contact: {
          name: userName,
          type: 'customer',
          contact: userPhone
        }
      },
      amount: Math.round(numericAmount * 100), // convert to paise
      currency: 'INR',
      mode: 'UPI',
      purpose: 'payout',
      queue_if_low_balance: true,
      reference_id: `withdraw_${userId.slice(0, 5)}_${Date.now()}`,
      narration: 'Kishan Seva Wallet Payout'
    };

    console.log('Sending Razorpay Payout Payload:', JSON.stringify(razorpayPayload));

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(razorpayPayload)
    });

    const razorpayData = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error('Razorpay Payout API Error response:', razorpayData);
      const razorpayErrorMsg = razorpayData.error?.description || 'Failed to process payout with Razorpay';
      return NextResponse.json({ error: razorpayErrorMsg }, { status: 400 });
    }

    // Razorpay response contains a payout ID (e.g. pout_XXXX) and a status (e.g. processing, processed, queued, reversed, rejected)
    const payoutId = razorpayData.id;
    const payoutStatus = razorpayData.status;

    // Map Razorpay payout status to our app status:
    // "processed" -> "completed"
    // "processing" or "queued" -> "pending"
    // "reversed", "rejected", "failed" -> "rejected"
    let appStatus: 'completed' | 'pending' | 'rejected' = 'pending';
    if (payoutStatus === 'processed') {
      appStatus = 'completed';
    } else if (['reversed', 'rejected', 'failed'].includes(payoutStatus)) {
      appStatus = 'rejected';
      return NextResponse.json({ error: `Razorpay payout status: ${payoutStatus}. Transfer failed.` }, { status: 400 });
    }

    // Deduct the wallet balance from the user's Firestore document
    await updateDoc(userDocRef, {
      walletBalance: currentBalance - numericAmount
    });

    // Save the withdrawal request to the withdrawals collection
    const withdrawalDoc = await addDoc(collection(db, 'withdrawals'), {
      userId,
      userName,
      amount: numericAmount,
      upiId: upiId.trim(),
      status: appStatus,
      payoutId: payoutId || '',
      requestedAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      withdrawalId: withdrawalDoc.id,
      payoutId,
      status: appStatus
    });

  } catch (error: unknown) {
    console.error('Error processing payout API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error processing payout';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
