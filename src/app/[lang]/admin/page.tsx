'use client';

import React, { useState } from 'react';
import { Users, Package, FileText, CreditCard } from 'lucide-react';
import FarmersTab from '@/components/admin/FarmersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import WithdrawalsTab from '@/components/admin/WithdrawalsTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'farmers' | 'products' | 'orders' | 'withdrawals'>('farmers');

  return (
    <div className="min-h-screen bg-[#fbf9f5] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#122c1f] flex items-center gap-3">
            Admin Portal
          </h1>
          <p className="text-[#77574d] mt-1">Manage the Kishan Seva Samiti platform operations.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('farmers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'farmers' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" /> Farmers
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'products' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package className="w-4 h-4" /> Marketplace
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'orders' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Orders
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'withdrawals' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Withdrawals
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'farmers' && <FarmersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'withdrawals' && <WithdrawalsTab />}
        </div>
        
      </div>
    </div>
  );
}
