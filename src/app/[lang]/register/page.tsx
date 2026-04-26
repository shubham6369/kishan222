'use client';

import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegistrationForm from "@/components/RegistrationForm";
import { UserCheck } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const { dict } = useLanguage();
  
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
          {/* Content side */}
          <div className="lg:w-1/3 space-y-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
              <UserCheck className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif text-primary">{dict.register.title}</h1>
              <p className="text-primary/60 font-body text-lg leading-relaxed">
                {dict.register.subtitle}
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-4 card-layer-1">
                <div className="w-2 h-2 mt-2 bg-secondary rounded-full shrink-0" />
                <p className="text-sm font-body text-primary/70">{dict.register.benefit_verified}</p>
              </div>
              <div className="flex gap-4 p-4 card-layer-1">
                <div className="w-2 h-2 mt-2 bg-secondary rounded-full shrink-0" />
                <p className="text-sm font-body text-primary/70">{dict.register.benefit_schemes}</p>
              </div>
              <div className="flex gap-4 p-4 card-layer-1">
                <div className="w-2 h-2 mt-2 bg-secondary rounded-full shrink-0" />
                <p className="text-sm font-body text-primary/70">{dict.register.benefit_referral}</p>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="lg:w-2/3 w-full">
            <React.Suspense fallback={<div className="h-96 flex items-center justify-center bg-white rounded-3xl animate-pulse">Loading registration...</div>}>
              <RegistrationForm />
            </React.Suspense>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
