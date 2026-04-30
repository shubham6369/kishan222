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

import { LanguageProvider, Dictionary } from "@/context/LanguageContext";
import FramerMotionProvider from "@/components/animations/FramerMotionProvider";

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/lib/dictionaries/en.json').then((module) => module.default as Dictionary),
  hi: () => import('@/lib/dictionaries/hi.json').then((module) => module.default as Dictionary),
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <LanguageProvider lang={lang} dict={dict}>
          <AuthProvider>
            <CartProvider>
              <FramerMotionProvider>
                {children}
              </FramerMotionProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


