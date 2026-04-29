'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, MapPin, CheckCircle, Clock, XCircle, Users, Filter, ArrowUpRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Farmer {
  id: string;
  fullName: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  crops: string;
  landSize: string;
  membershipId: string;
  photoUrl?: string;
  photoBase64?: string;
  registrationDate: string;
  membershipFeePaid: number;
  status?: 'pending' | 'verified' | 'rejected';
}

export default function FarmersTab() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFarmers = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetchedFarmers: Farmer[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.membershipId) {
          fetchedFarmers.push({
            id: doc.id,
            ...data
          } as Farmer);
        }
      });
      fetchedFarmers.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
      setFarmers(fetchedFarmers);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchFarmers();
    };
    init();
  }, [fetchFarmers]);

  const updateStatus = async (farmerId: string, status: 'verified' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'users', farmerId), { status });
      setFarmers(farmers.map(f => f.id === farmerId ? { ...f, status } : f));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredFarmers = farmers.filter(f => 
    f.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white">Farmer Database</h2>
          <p className="text-white/40 text-sm mt-1">Review and verify member profiles</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by name, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-accent outline-none text-sm text-white placeholder:text-white/20 transition-all"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Members', value: farmers.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Verified', value: farmers.filter(f => f.status === 'verified').length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Pending Approval', value: farmers.filter(f => f.status !== 'verified' && f.status !== 'rejected').length, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 group hover:bg-white/10 transition-all"
          >
            <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Member Info</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Location</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                      <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Accessing Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">No matching profiles found</p>
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer, index) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={farmer.id} 
                    className="group hover:bg-white/5 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl bg-white/10 overflow-hidden shrink-0 border border-white/10">
                          {farmer.photoUrl || farmer.photoBase64 ? (
                            <Image 
                              src={farmer.photoUrl || farmer.photoBase64 || ''} 
                              alt={farmer.fullName} 
                              width={48}
                              height={48}
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white/20">
                              {farmer.fullName?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {farmer.fullName}
                            {farmer.status === 'verified' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <div className="text-xs text-white/40 mt-1 font-mono tracking-tighter">ID: {farmer.membershipId}</div>
                          <div className="text-[10px] text-accent mt-1 uppercase font-bold tracking-widest">{farmer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        <span>{farmer.village}, {farmer.district}</span>
                      </div>
                      <div className="text-[10px] text-white/30 mt-1 uppercase tracking-widest font-bold">
                        {farmer.crops} • {farmer.landSize} Acres
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        farmer.status === 'verified' 
                          ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" 
                          : farmer.status === 'rejected'
                          ? "bg-red-400/10 text-red-400 border-red-400/20"
                          : "bg-orange-400/10 text-orange-400 border-orange-400/20"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                          farmer.status === 'verified' ? "bg-emerald-400" : farmer.status === 'rejected' ? "bg-red-400" : "bg-orange-400"
                        )} />
                        {farmer.status || 'pending'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        {farmer.status !== 'verified' && (
                          <button 
                            onClick={() => updateStatus(farmer.id, 'verified')}
                            className="p-2 bg-emerald-400/10 text-emerald-400 rounded-xl hover:bg-emerald-400 hover:text-primary transition-all shadow-lg shadow-emerald-400/10"
                            title="Verify Farmer"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {farmer.status !== 'rejected' && (
                          <button 
                            onClick={() => updateStatus(farmer.id, 'rejected')}
                            className="p-2 bg-red-400/10 text-red-400 rounded-xl hover:bg-red-400 hover:text-white transition-all shadow-lg shadow-red-400/10"
                            title="Reject Profile"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button className="p-2 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                          <ArrowUpRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
