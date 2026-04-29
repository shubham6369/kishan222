'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Image as ImageIcon, 
  Type, 
  Tag, 
  IndianRupee, 
  Info,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Package
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function NewProductPage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains',
    price: '',
    unit: 'kg',
    description: '',
    isOrganic: true,
    variety: '',
    stock: '',
    deliveryCharge: '0'
  });

  const [images, setImages] = useState<{file: File, url: string}[]>([]);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImages([...images, { file, url }]);
    }
  };

  const handlePublish = async () => {
    if (!user || !userData) {
      alert("Please login first.");
      return;
    }
    if (!formData.name || !formData.price || images.length === 0) {
      alert("Please fill all required fields and add at least one image.");
      return;
    }
    
    setLoading(true);
    try {
      const uploadedImageUrls = [];
      for (const img of images) {
        const imageRef = ref(storage, `products/${user.uid}/${Date.now()}_${img.file.name}`);
        const uploadTask = await uploadBytesResumable(imageRef, img.file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        uploadedImageUrls.push(downloadURL);
      }

      await addDoc(collection(db, 'products'), {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        deliveryCharge: Number(formData.deliveryCharge),
        sellerId: user.uid,
        sellerName: userData.fullName || "Farmer",
        sellerLocation: `${userData.village || ''}, ${userData.state || ''}`,
        sellerPhoto: userData.photoBase64 || null,
        images: uploadedImageUrls,
        createdAt: serverTimestamp(),
        status: 'active'
      });
      alert('Product published successfully!');
      router.push('/dashboard/products'); // Redirect to products list (if exists) or marketplace
    } catch (err) {
      console.error(err);
      alert('Error publishing product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products" className="p-3 bg-white rounded-xl border border-black/5 hover:bg-[#122c1f] hover:text-white transition-all shadow-sm group">
            <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
            <h1 className="text-3xl font-serif font-bold text-[#122c1f]">List New Produce</h1>
            <p className="text-[#77574d] text-sm">Tell the world about your harvest.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
            <div className="p-10 bg-white rounded-[40px] border border-black/5 shadow-sm space-y-10">
                
                {/* Product Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#122c1f]/5 flex items-center justify-center text-[#122c1f]">
                            <Type className="w-4 h-4" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-[#122c1f]">Basic Information</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Product Name</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Basmati Rice (Traditional)"
                                className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Category</label>
                                <select 
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body appearance-none"
                                >
                                    <option>Cow Dung Fertilizer</option>
                                    <option>Dried Cow Dung Cakes</option>
                                    <option>Vermicompost</option>
                                    <option>Gaumutra</option>
                                    <option>Organic Pest Control</option>
                                    <option>Natural Farming Kits</option>
                                    <option>Seeds</option>
                                    <option>Tools</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Variety/Brand</label>
                                <input 
                                    type="text"
                                    value={formData.variety}
                                    onChange={(e) => setFormData({...formData, variety: e.target.value})}
                                    placeholder="e.g. CSR-30"
                                    className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#122c1f]/5 flex items-center justify-center text-[#122c1f]">
                            <IndianRupee className="w-4 h-4" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-[#122c1f]">Pricing Details</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Price (₹)</label>
                            <input 
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                placeholder="0.00"
                                className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Unit</label>
                            <select 
                                value={formData.unit}
                                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body appearance-none"
                            >
                                <option>kg</option>
                                <option>Quintal</option>
                                <option>Litre</option>
                                <option>Bag (25kg)</option>
                                <option>Bag (50kg)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Stock Available</label>
                            <input 
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                placeholder="10"
                                className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Delivery Charge (₹)</label>
                            <input 
                                type="number"
                                value={formData.deliveryCharge}
                                onChange={(e) => setFormData({...formData, deliveryCharge: e.target.value})}
                                placeholder="50"
                                className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-2xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body"
                            />
                        </div>
                    </div>
                </div>

                {/* Bio/Story Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#122c1f]/5 flex items-center justify-center text-[#122c1f]">
                            <Info className="w-4 h-4" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-[#122c1f]">The Story</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#77574d]">Product Narrative</label>
                        <textarea 
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Tell buyers why your harvest is special. Mention soil health, water source, or traditional methods."
                            className="w-full px-6 py-4 bg-[#fbf9f5] border-none rounded-3xl focus:ring-2 focus:ring-[#122c1f]/10 transition-all font-body resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        onClick={handlePublish}
                        disabled={loading}
                        className="w-full py-6 bg-[#122c1f] text-white rounded-[24px] font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-[#122c1f]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? 'Publishing...' : 'Publish Harvest to Marketplace'}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        {/* Media Column */}
        <div className="space-y-8">
            <div className="p-8 bg-white rounded-[32px] border border-black/5 shadow-sm space-y-6">
                <h4 className="text-lg font-serif font-bold text-[#122c1f]">Produce Gallery</h4>
                <p className="text-xs text-[#77574d]">High quality photos help you sell 3x faster.</p>
                
                <div className="grid grid-cols-2 gap-4">
                    {images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-[#fbf9f5] relative overflow-hidden group">
                            <Image src={img.url} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="p-2 bg-white rounded-full">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <label className="cursor-pointer aspect-square rounded-2xl bg-[#fbf9f5] border-2 border-dashed border-[#122c1f]/10 flex flex-col items-center justify-center gap-2 hover:bg-[#122c1f]/5 transition-all text-[#122c1f]/40 hover:text-[#122c1f]">
                        <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
                        <Plus className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase">Add Photo</span>
                    </label>
                </div>
            </div>

            <div className="p-8 bg-[#122c1f] rounded-[32px] text-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 className="w-16 h-16" />
                </div>
                <h4 className="text-lg font-serif font-bold relative z-10">Organic Promise</h4>
                <p className="text-sm opacity-60 relative z-10 leading-relaxed">
                    By listing this product, you certify that it follows the Samiti&apos;s Organic standards and ethical farming practices.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-green-400 relative z-10">
                    <Package className="w-4 h-4" />
                    Samiti Verified Tag will be applied.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
