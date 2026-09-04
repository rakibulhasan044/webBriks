import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const CommonDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default CommonDashboardLayout;
