import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKey',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourSecret',
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id, amount: options.amount });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
