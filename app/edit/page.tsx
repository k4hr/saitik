import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import FreeEditShell from "@/components/create/free-edit-shell";
import { getSession } from "@/lib/auth";

export default async function EditPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <FreeEditShell />
      <SiteFooter />
    </main>
  );
}
