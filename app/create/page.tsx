import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import CreateOrderShell from "@/components/create/create-order-shell";

export default async function CreatePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const style = typeof params.style === "string" ? params.style : undefined;

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <CreateOrderShell initialStyleId={style} />
      <SiteFooter />
    </main>
  );
}
