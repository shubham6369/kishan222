import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutContent from '@/components/about/AboutContent';
import { getDictionary } from '@/lib/get-dictionary';

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen bg-[#fbf9f5]">
      <Navbar lang={lang} dict={dict} />
      <AboutContent lang={lang} dict={dict} />
      <Footer lang={lang} dict={dict} />
    </main>
  );
}
