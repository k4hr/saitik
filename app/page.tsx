import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardOverview from "@/components/dashboard/dashboard-overview";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <DashboardOverview />
      <SiteFooter />
    </main>
  );
}
