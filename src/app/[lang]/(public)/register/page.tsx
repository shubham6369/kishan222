import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { UserCheck } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";

const RegistrationForm = dynamic(() => import("@/components/RegistrationForm"), {
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-white rounded-3xl animate-pulse border border-black/5 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#122c1f]/10 border-t-[#122c1f] rounded-full animate-spin" />
        <p className="text-[#122c1f]/40 font-bold uppercase tracking-widest text-[10px]">Initializing Secure Form...</p>
      </div>
    </div>
  )
});

export default async function RegisterPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <main className="min-h-screen bg-surface">
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
            <Suspense fallback={
              <div className="h-[600px] flex items-center justify-center bg-white rounded-3xl animate-pulse border border-black/5 shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-[#122c1f]/10 border-t-[#122c1f] rounded-full animate-spin" />
                  <p className="text-[#122c1f]/40 font-bold uppercase tracking-widest text-[10px]">Loading Form...</p>
                </div>
              </div>
            }>
              <RegistrationForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
