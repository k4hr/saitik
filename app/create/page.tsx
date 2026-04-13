import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import CreateOrderShell from "@/components/create/create-order-shell";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <CreateOrderShell />
      <SiteFooter />
    </main>
  );
}
