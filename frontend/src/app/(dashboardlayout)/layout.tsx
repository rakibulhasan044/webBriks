import { Sidebar } from "@/components/modules/Dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Hidden on mobile by default, shown on desktop */}
      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Optional Mobile Header for later: 
        <header className="h-16 border-b border-slate-200 bg-white md:hidden">
           Mobile Menu Toggle 
        </header> 
        */}
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
