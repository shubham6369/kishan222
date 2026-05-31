import ReferralsContent from "@/components/dashboard/ReferralsContent";
import { getDictionary } from "@/lib/get-dictionary";

export default async function ReferralsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ReferralsContent lang={lang} dict={dict} />;
}
