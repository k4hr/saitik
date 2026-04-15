import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getIsAdmin(email: string | undefined): boolean {
  if (!email) {
    return false;
  }

  const raw = process.env.ADMIN_EMAILS ?? "";
  const adminEmails = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase());
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      login: true,
      creditBalance: true,
    },
  });

  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <DashboardOverview
        login={user.login}
        balance={user.creditBalance}
        isAdmin={getIsAdmin(session.email)}
      />
      <SiteFooter />
    </main>
  );
}
