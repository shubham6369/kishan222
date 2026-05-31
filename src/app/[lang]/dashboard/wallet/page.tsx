import WalletContent from "@/components/dashboard/WalletContent";
import { getDictionary } from "@/lib/get-dictionary";

export default async function WalletPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <WalletContent lang={lang} dict={dict} />;
}
