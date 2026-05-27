import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, customerId, customerPhone, customerName, customerEmail } = await req.json();

    if (!amount || !customerId || !customerPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId) {
      return NextResponse.json({ error: 'Razorpay Key ID is not configured' }, { status: 500 });
    }

    if (!keySecret) {
      return NextResponse.json({ 
        error: 'Razorpay Key Secret is missing. Please set RAZORPAY_KEY_SECRET in your .env.local file to enable payments.' 
      }, { status: 500 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create Razorpay Order
    // Amount must be in the smallest currency unit (paise for INR). 1 INR = 100 paise.
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: 'rcpt_' + Date.now().toString().slice(-10),
      notes: {
        customerId,
        customerPhone,
        customerName: customerName || '',
        customerEmail: customerEmail || '',
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error: unknown) {
    console.error('Error creating Razorpay order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error creating Razorpay order';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
