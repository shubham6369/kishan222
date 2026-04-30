import WalletContent from "@/components/dashboard/WalletContent";
import { getDictionary } from "@/lib/get-dictionary";

export default async function WalletPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);

  return <WalletContent lang={lang} dict={dict} />;
}
