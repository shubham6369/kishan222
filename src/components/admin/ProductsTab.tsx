'use client';

import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Package } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    sellerName: string;
    description: string;
    price: number;
    stock: number;
    status: 'pending' | 'approved' | 'rejected';
    image: string;
}

export default function ProductsTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const fetchedProducts: Product[] = [];
            querySnapshot.forEach((doc) => {
                fetchedProducts.push({
                    id: doc.id,
                    ...doc.data()
                } as Product);
            });
            // We should ideally sort by createdAt, but let's just reverse for newest first assuming natural order
            setProducts(fetchedProducts.reverse());
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (productId: string, status: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'products', productId), { status });
            setProducts(products.map(p => p.id === productId ? { ...p, status } : p));
            toast.success(`Product ${status}`);
        } catch (error) {
            console.error("Error updating product status:", error);
            toast.error("Failed to update status");
        }
    };

    const filteredProducts = products.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Manage Products</h2>
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
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
                            <th className="p-4">Product</th>
                            <th className="p-4">Seller</th>
                            <th className="p-4">Price / Stock</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">No products found.</td></tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0">
                                                <img src={product.image || 'https://placehold.co/100x100?text=No+Image'} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 line-clamp-1">{product.name}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-900">{product.sellerName}</td>
                                    <td className="p-4">
                                        <div className="text-gray-900 font-medium">₹{product.price}</div>
                                        <div className="text-xs text-gray-500">{product.stock} in stock</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                            product.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {(product.status || 'pending').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            {product.status !== 'approved' && (
                                                <button onClick={() => updateStatus(product.id, 'approved')} className="text-green-600 hover:bg-green-50 p-1.5 rounded" title="Approve">
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {product.status !== 'rejected' && (
                                                <button onClick={() => updateStatus(product.id, 'rejected')} className="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Reject">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
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
