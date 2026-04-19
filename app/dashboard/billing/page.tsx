import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardBilling from "@/components/dashboard/dashboard-billing";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function DashboardBillingPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      welcomeOfferEndsAt: true,
    },
  });

  if (!user) {
    redirect("/auth/sign-in");
  }

  const payments = await prisma.payment.findMany({
    where: {
      userId: user.id,
      status: "SUCCEEDED",
      creditsPurchased: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      creditsPurchased: true,
      amountRub: true,
      createdAt: true,
    },
  });

  const transactions = payments.map((item) => ({
    id: item.id,
    credits: item.creditsPurchased ?? 0,
    amountRub: item.amountRub,
    dateLabel: formatDateLabel(item.createdAt),
  }));

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <DashboardBilling
        transactions={transactions}
        welcomeOfferEndsAt={user.welcomeOfferEndsAt?.toISOString() ?? null}
      />
      <SiteFooter />
    </main>
  );
}
