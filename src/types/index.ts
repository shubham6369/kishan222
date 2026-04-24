export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    sellerId: string;
    deliveryCharge: number;
    weight: string;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdAt: any; // Firestore Timestamp
}

export interface Order {
    id: string;
    buyerId: string;
    buyerName: string;
    items: CartItem[];
    subtotal: number;
    deliveryTotal: number;
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentId?: string;
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdAt: any; // Firestore Timestamp
    sellerIds: string[]; // To query orders by seller
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recaptchaVerifier: any;
    }
}
