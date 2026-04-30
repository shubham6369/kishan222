import Sidebar from "@/components/dashboard/Sidebar";
import { getDictionary } from "@/lib/get-dictionary";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen bg-[#fbf9f5]">
      <Sidebar lang={lang} dict={dict} />
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="p-8 md:p-12 lg:p-16">
            {children}
        </div>
      </main>
    </div>
  );
}
