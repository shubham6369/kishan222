import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kishan Seva Samiti | Modern Rural Empowerment",
  description: "Premium services and organic marketplace for the modern farmer. Join the committee of heritage and health.",
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hi" }];
}

import { LanguageProvider } from "@/context/LanguageContext";

const dictionaries: Record<string, any> = {
  en: () => import('@/lib/dictionaries/en.json').then((module) => module.default),
  hi: () => import('@/lib/dictionaries/hi.json').then((module) => module.default),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await (dictionaries[lang] || dictionaries.en)();
  
  return (
    <html lang={lang} className={`${notoSerif.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body">
        <LanguageProvider lang={lang} dict={dict}>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


