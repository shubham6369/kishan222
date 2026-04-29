import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fbf9f5]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Semi-transparent navbar for dashboard context if needed, 
            but usually dashboard has its own header. 
            I'll skip the main navbar here to keep it focused. */}
        <div className="p-8 md:p-12 lg:p-16">
            {children}
        </div>
      </main>
    </div>
  );
}
