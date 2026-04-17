import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import DashboardOrders from "@/components/dashboard/dashboard-orders";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatStatus(status: string): string {
  switch (status) {
    case "DRAFT":
      return "Черновик";
    case "PENDING_PAYMENT":
      return "Ожидает оплату";
    case "PAID":
      return "Оплачено";
    case "PROCESSING":
      return "В обработке";
    case "DONE":
      return "Готово";
    case "FAILED":
      return "Ошибка";
    case "CANCELED":
      return "Отменено";
    default:
      return status;
  }
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function DashboardOrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
    },
  });

  if (!user) {
    redirect("/auth/sign-in");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      status: true,
      creditsSpent: true,
      createdAt: true,
      shareId: true,
      showcaseItem: {
        select: {
          title: true,
        },
      },
      assets: {
        where: {
          type: "RESULT",
        },
        take: 1,
        select: {
          id: true,
        },
      },
    },
  });

  const generations = orders.map((order) => {
    const hasResult = order.assets.length > 0 && order.status === "DONE";

    return {
      id: order.id,
      title:
        order.title?.trim() ||
        order.showcaseItem?.title ||
        "Генерация без названия",
      status: formatStatus(order.status),
      credits: order.creditsSpent,
      createdAtLabel: formatDateLabel(order.createdAt),
      imagePath: hasResult ? `/api/results/${order.shareId}` : null,
      downloadPath: hasResult
        ? `/api/results/${order.shareId}?download=1`
        : null,
      sharePath: hasResult ? `/share/${order.shareId}` : null,
    };
  });

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />
      <DashboardOrders generations={generations} />
      <SiteFooter />
    </main>
  );
}
