import { NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

const cashfree = new Cashfree(
  process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

export async function POST(req: Request) {
  try {
    const { amount, customerId, customerPhone, customerName, customerEmail, lang = 'en' } = await req.json();

    if (!amount || !customerId || !customerPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: "order_" + Date.now(),
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
        customer_name: customerName || 'Customer',
        customer_email: customerEmail || 'test@example.com'
      },
      order_meta: {
        return_url: `${req.headers.get('origin')}/${lang}/payment/verify?order_id={order_id}`
      }
    };

    const response = await cashfree.PGCreateOrder(request);
    
    return NextResponse.json({ 
      paymentSessionId: response.data.payment_session_id,
      orderId: response.data.order_id
    });

  } catch (error: any) {
    console.error('Error creating Cashfree order:', error.response?.data || error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
