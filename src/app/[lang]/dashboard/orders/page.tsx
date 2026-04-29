'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Order } from '@/types';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function SellerOrdersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            const q = query(
                collection(db, 'orders'),
                where('sellerIds', 'array-contains', user.uid)
                // Firestore requires a composite index if combining array-contains with orderBy.
                // We'll sort on the client side to avoid forcing the user to create an index right away.
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedOrders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Order[];
                
                // Client-side sort by createdAt descending
                fetchedOrders.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
                
                setOrders(fetchedOrders);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching seller orders:", error);
                toast.error("Failed to load your orders");
                setIsLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user, loading, router]);

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        try {
            setUpdatingOrderId(orderId);
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: newStatus
            });
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Your Sales Orders</h1>
                    <p className="text-gray-600 mt-2">Manage incoming orders from customers for your products.</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500">When customers buy your products, the orders will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="p-4 pl-6">Order ID & Date</th>
                                    <th className="p-4">Customer Details</th>
                                    <th className="p-4">Your Items</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4">Status & Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => {
                                    // Filter items to show only the ones belonging to the current seller
                                    const myItems = order.items.filter(item => item.sellerId === user?.uid);
                                    
                                    // If for some reason there are no items for this seller (edge case), skip rendering
                                    if (myItems.length === 0) return null;

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 pl-6 align-top">
                                                <div className="font-mono text-xs text-gray-500 mb-1">
                                                    {order.id.slice(-8).toUpperCase()}
                                                </div>
                                                <div className="text-sm text-gray-900">
                                                    {order.createdAt?.toDate().toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="font-medium text-gray-900">{order.buyerName}</div>
                                                <div className="text-sm text-gray-500 mt-1">{order.shippingAddress.phone}</div>
                                                <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={`${order.shippingAddress.address}, ${order.shippingAddress.city}`}>
                                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="space-y-2">
                                                    {myItems.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0 relative">
                                                                <Image 
                                                                    src={item.image || 'https://placehold.co/100x100?text=No+Image'} 
                                                                    alt={item.name} 
                                                                    fill 
                                                                    className="object-cover" 
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    Qty: {item.quantity} × ₹{item.price}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                                                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.paymentStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex flex-col gap-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit ${
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                    
                                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                        <select
                                                            disabled={updatingOrderId === order.id}
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                                                            className="text-xs border-gray-200 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
