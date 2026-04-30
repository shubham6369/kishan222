import dynamic from "next/dynamic";
import { getDictionary } from "@/lib/get-dictionary";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import Services from "@/components/home/Services";

// Dynamic imports for below-the-fold content to improve initial load time
const Sustainability = dynamic(() => import("@/components/home/Sustainability"), {
  loading: () => <div className="h-96 bg-primary animate-pulse" />
});
const FinalCTA = dynamic(() => import("@/components/home/FinalCTA"), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});

export default async function Home({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen">
      <Hero lang={lang} dict={dict} />
      <TrustBar />
      <Services lang={lang} dict={dict} />
      <Sustainability />
      <FinalCTA lang={lang} dict={dict} />
    </main>
  );
}
