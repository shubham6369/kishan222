import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { getDictionary } from '@/lib/get-dictionary';

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen bg-[#fbf9f5]">
      <section className="container mx-auto px-4 py-20">
        <LoginForm lang={lang} dict={dict} />
      </section>
    </main>
  );
}
