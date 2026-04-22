'use client';

import React, { useEffect, useState } from 'react';
import { Search, MapPin, CheckCircle, Clock, XCircle, Tractor, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
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
  };

  const updateStatus = async (farmerId: string, status: 'verified' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'users', farmerId), { status });
      setFarmers(farmers.map(f => f.id === farmerId ? { ...f, status } : f));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const filteredFarmers = farmers.filter(f => 
    f.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-[#122c1f]">Farmer Profiles</h2>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#77574d]/50" />
          <input
            type="text"
            placeholder="Search by name, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#122c1f]/10 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#122c1f]/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#77574d] uppercase">Total Farmers</p>
            <h3 className="text-xl font-bold text-[#122c1f]">{farmers.length}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#122c1f]/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#77574d] uppercase">Verified</p>
            <h3 className="text-xl font-bold text-[#122c1f]">{farmers.filter(f => f.status === 'verified').length}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#122c1f]/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#77574d] uppercase">Pending</p>
            <h3 className="text-xl font-bold text-[#122c1f]">{farmers.filter(f => f.status !== 'verified' && f.status !== 'rejected').length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#122c1f]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#122c1f]">
            <thead className="bg-[#122c1f]/5 text-[#77574d] font-bold uppercase tracking-wider text-xs border-b">
              <tr>
                <th className="px-4 py-3">Farmer</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#122c1f]/5">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#77574d]">Loading...</td></tr>
              ) : filteredFarmers.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#77574d]">No farmers found.</td></tr>
              ) : (
                filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
                          {farmer.photoUrl || farmer.photoBase64 ? (
                            <img src={farmer.photoUrl || farmer.photoBase64} alt={farmer.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">{farmer.fullName?.charAt(0)}</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-1">
                            {farmer.fullName} {farmer.status === 'verified' && <CheckCircle className="w-3 h-3 text-green-600" />}
                          </div>
                          <div className="text-xs text-[#77574d]">{farmer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#77574d]">
                      <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {farmer.village}, {farmer.district}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#77574d]">
                      <div>{farmer.landSize} Acres</div>
                      <div>{farmer.crops}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-mono border border-green-100">{farmer.membershipId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {farmer.status !== 'verified' && (
                          <button onClick={() => updateStatus(farmer.id, 'verified')} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Verify"><CheckCircle className="w-4 h-4" /></button>
                        )}
                        {farmer.status !== 'rejected' && (
                          <button onClick={() => updateStatus(farmer.id, 'rejected')} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Reject"><XCircle className="w-4 h-4" /></button>
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
    </div>
  );
}
