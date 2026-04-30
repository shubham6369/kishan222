import DashboardContent from "@/components/dashboard/DashboardContent";
import { getDictionary } from "@/lib/get-dictionary";

export default async function DashboardPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);

  return <DashboardContent lang={lang} dict={dict} />;
}
