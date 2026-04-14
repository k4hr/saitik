import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardSettings from "@/components/dashboard/dashboard-settings";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      login: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <DashboardSettings
        login={user.login}
        email={user.email}
      />
      <SiteFooter />
    </main>
  );
}
