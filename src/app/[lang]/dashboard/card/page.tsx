import CardContent from "@/components/dashboard/CardContent";
import { getDictionary } from "@/lib/get-dictionary";

export default async function CardPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(lang);

  return <CardContent lang={lang} dict={dict} />;
}
