'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Order } from '@/types';
import { toast } from 'react-hot-toast';

export default function OrdersTab() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'orders'));
            const fetchedOrders: Order[] = [];
            querySnapshot.forEach((doc) => {
                fetchedOrders.push({
                    id: doc.id,
                    ...doc.data()
                } as Order);
            });
            // Client-side sort by createdAt descending
            fetchedOrders.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Platform Orders</h2>
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID or Buyer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Order ID & Date</th>
                            <th className="p-4">Buyer</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Global Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">No orders found.</td></tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="p-4 align-top">
                                        <div className="font-mono text-xs text-gray-500 mb-1">{order.id.slice(-8).toUpperCase()}</div>
                                        <div>{order.createdAt?.toDate().toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-medium">{order.buyerName}</div>
                                        <div className="text-xs text-gray-500">{order.items.length} items</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-medium text-gray-900">₹{order.totalAmount}</div>
                                        <div className="text-xs text-gray-500">Del: ₹{order.deliveryTotal}</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.paymentStatus.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
