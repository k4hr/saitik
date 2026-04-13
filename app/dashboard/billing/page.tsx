import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardBilling from "@/components/dashboard/dashboard-billing";

export default function DashboardBillingPage() {
  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <DashboardBilling />
      <SiteFooter />
    </main>
  );
}
