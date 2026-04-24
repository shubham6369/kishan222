import { useLanguage } from '@/context/LanguageContext';

export default function CheckoutPage({ params }: { params: { lang: string } }) {
  const { cart, subtotal, deliveryTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { dict } = useLanguage();
  
  const grandTotal = subtotal + deliveryTotal;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push(`/${params.lang}/cart`);
    }
  }, [cart, router, params.lang]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const verifyPaymentAndCreateOrder = async (razorpayResponse: any, orderId: string) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        })
      });
      const data = await response.json();
      if (data.isOk) {
        // Create order in Firestore
        const sellerIds = [...new Set(cart.map(item => item.sellerId))];
        
        await addDoc(collection(db, 'orders'), {
          buyerId: user?.uid || 'guest',
          buyerName: formData.fullName,
          items: cart,
          subtotal,
          deliveryTotal,
          totalAmount: grandTotal,
          status: 'pending',
          paymentStatus: 'paid',
          paymentId: razorpayResponse.razorpay_payment_id,
          shippingAddress: formData,
          createdAt: serverTimestamp(),
          sellerIds
        });

        clearCart();
        router.push(`/${params.lang}/dashboard/purchases?success=1`);
      } else {
        alert(dict.checkout.payment_failed);
      }
    } catch (err) {
      console.error(err);
      alert(dict.checkout.payment_error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(dict.checkout.login_prompt);
      return;
    }

    setLoading(true);

    try {
      const loadScript = () => new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const res = await loadScript();
      if (!res) {
        alert(dict.checkout.sdk_failed);
        setLoading(false);
        return;
      }

      // 1. Create order on backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal })
      });
      const data = await response.json();

      if (!data.orderId) {
        throw new Error(dict.checkout.order_failed);
      }

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YourKey',
        amount: data.amount,
        currency: "INR",
        name: "Kishan Seva Samiti",
        description: dict.checkout.order_desc,
        order_id: data.orderId,
        handler: async function (response: any) {
          await verifyPaymentAndCreateOrder(response, data.orderId);
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },
        theme: {
          color: "#122c1f"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert(dict.checkout.checkout_error);
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-[#122c1f] mb-8">{dict.checkout.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="p-8 bg-white rounded-[32px] border border-black/5 shadow-sm space-y-8">
                
                <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                  <div className="w-8 h-8 rounded-full bg-[#122c1f]/5 flex items-center justify-center text-[#122c1f]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#122c1f]">{dict.checkout.shipping_address}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.checkout.full_name} *</label>
                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.checkout.phone} *</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.checkout.address} *</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.checkout.city} *</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.checkout.state} *</label>
                    <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">{dict.checkout.pincode} *</label>
                    <input required name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body" />
                  </div>
                </div>
              </form>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="p-8 bg-white rounded-[32px] border border-black/5 shadow-sm space-y-6 sticky top-24">
                <h3 className="text-xl font-serif font-bold text-[#122c1f]">{dict.checkout.your_order}</h3>
                
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-[#122c1f] truncate max-w-[60%] font-medium">{item.quantity}x {item.name}</span>
                      <span className="text-[#77574d]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-sm text-[#77574d] pt-4 border-t border-black/5">
                  <div className="flex justify-between">
                    <span>{dict.checkout.subtotal}</span>
                    <span className="font-bold text-[#122c1f]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{dict.checkout.delivery}</span>
                    <span className="font-bold text-[#122c1f]">₹{deliveryTotal}</span>
                  </div>
                  <div className="pt-4 border-t border-black/5 flex justify-between items-end">
                    <span className="font-bold text-[#122c1f]">{dict.checkout.total}</span>
                    <span className="text-2xl font-serif font-bold text-[#122c1f]">₹{grandTotal}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full py-4 bg-[#122c1f] text-white rounded-2xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl hover:shadow-[#122c1f]/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  {loading ? dict.checkout.processing : dict.checkout.pay_button}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#77574d]">
                  <ShieldCheck className="w-3 h-3" />
                  {dict.checkout.secure_payment}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
