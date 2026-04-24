import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureBusinessOfferForUser } from "@/lib/business-offer";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  await ensureBusinessOfferForUser(session.userId);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      login: true,
      creditBalance: true,
      welcomeOfferEndsAt: true,
      businessOfferEndsAt: true,
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
        isAdmin={session.role === "ADMIN"}
        welcomeOfferEndsAt={user.welcomeOfferEndsAt?.toISOString() ?? null}
        businessOfferEndsAt={user.businessOfferEndsAt?.toISOString() ?? null}
      />
      <SiteFooter />
    </main>
  );
}
