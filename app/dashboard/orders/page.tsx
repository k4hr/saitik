import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardOrders from "@/components/dashboard/dashboard-orders";

export default function DashboardOrdersPage() {
  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <DashboardOrders />
      <SiteFooter />
    </main>
  );
}
