import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import StylesPageClient from "@/components/styles/styles-page-client";
import { getSession } from "@/lib/auth";

export default async function StylesPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <StylesPageClient isAuthenticated={Boolean(session)} />
      <SiteFooter />
    </main>
  );
}
