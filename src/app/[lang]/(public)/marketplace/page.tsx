import React from 'react';
import MarketplaceContent from '@/components/marketplace/MarketplaceContent';
import { getDictionary } from '@/lib/get-dictionary';

export default async function MarketplacePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      <MarketplaceContent lang={lang} dict={dict} />
    </div>
  );
}
