import { getDictionary } from "@/lib/get-dictionary";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CardFeatures from "@/components/home/CardFeatures";

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
      <CardFeatures lang={lang} dict={dict} />
    </main>
  );
}
