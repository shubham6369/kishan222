import ReferralsContent from "@/components/dashboard/ReferralsContent";
import { getDictionary } from "@/lib/get-dictionary";

export default async function ReferralsPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);

  return <ReferralsContent lang={lang} dict={dict} />;
}
