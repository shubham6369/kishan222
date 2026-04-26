import type { Timestamp } from 'firebase/firestore';
import type { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

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

export interface UserData {
    uid: string;
    fullName: string;
    phone: string;
    membershipId?: string;
    membershipCardUnlocked?: boolean;
    registrationDate?: string;
    photoUrl?: string;
    photoBase64?: string;
    village?: string;
    district?: string;
    state?: string;
    crops?: string;
    landSize?: string;
    isAdmin?: boolean;
    walletBalance?: number;
    referralCode?: string;
    referredBy?: string;
    stats?: {
        earnings: number;
        totalReferrals: number;
        activeListings: number;
    };
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Timestamp;
}

export interface Withdrawal {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    status: 'pending' | 'completed' | 'rejected';
    requestedAt: Timestamp;
    upiId?: string;
    bankAccount?: string;
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
    createdAt: Timestamp;
    sellerIds: string[];
}

export interface Product {
    id: string;
    name: string;
    sellerId: string;
    sellerName: string;
    description: string;
    price: number;
    stock: number;
    status: 'pending' | 'approved' | 'rejected';
    image: string;
    images?: string[];
    category?: string;
    unit?: string;
    rating?: number;
    farmer?: string;
    isOrganic?: boolean;
    deliveryCharge?: number;
    createdAt?: Timestamp;
}

export interface Referral {
    id: string;
    referredUserId: string;
    referredUserName: string;
    rewardAmount: number;
    createdAt: Timestamp;
    status: 'pending' | 'completed';
}

interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => Promise<void>;
    prefill: {
        name: string;
        contact: string;
        email?: string;
    };
    theme: { color: string };
    modal?: {
        ondismiss: () => void;
    };
}

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier | undefined;
        confirmationResult: ConfirmationResult | undefined;
        Razorpay: {
            new (options: RazorpayOptions): {
                open: () => void;
            };
        };
    }
}

