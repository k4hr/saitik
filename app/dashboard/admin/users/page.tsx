import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Shield } from "lucide-react";
import { CreditTransactionType, OrderStatus } from "@prisma/client";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import Container from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [users, generationStats, spendStats] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        login: true,
        role: true,
        creditBalance: true,
        createdAt: true,
      },
    }),
    prisma.order.groupBy({
      by: ["userId"],
      where: {
        status: {
          notIn: [OrderStatus.DRAFT, OrderStatus.CANCELED],
        },
      },
      _count: {
        _all: true,
      },
    }),
    prisma.creditTransaction.groupBy({
      by: ["userId"],
      where: {
        type: CreditTransactionType.SPEND,
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const generationsMap = new Map(
    generationStats.map((item) => [item.userId, item._count._all]),
  );

  const spentCreditsMap = new Map(
    spendStats.map((item) => [item.userId, Math.abs(item._sum.amount ?? 0)]),
  );

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      <section className="py-12 sm:py-14 lg:py-18">
        <Container>
          <div className="mx-auto max-w-6xl rounded-[32px] border border-white/60 bg-white/45 p-6 shadow-[0_24px_80px_rgba(91,67,49,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#bc9670] text-white shadow-[0_10px_24px_rgba(95,69,48,0.18)]">
                <Users className="size-5" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                  Админ меню
                </p>
                <h1 className="mt-1 text-4xl leading-[1.06] sm:text-5xl">
                  Пользователи сайта
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#726458] sm:text-lg">
              Здесь отображаются все зарегистрированные пользователи, дата
              регистрации, количество генераций и потраченные кредиты.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                type="button"
                size="xl"
                className="pointer-events-none rounded-[22px] bg-[#bc9670] text-[#2f241d]"
              >
                Пользователи
              </Button>

              <Button asChild variant="secondary" size="xl">
                <Link href="/dashboard/admin">Назад в админ меню</Link>
              </Button>
            </div>

            <Card className="mt-8 rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
              <CardHeader>
                <CardTitle>Список пользователей</CardTitle>
                <CardDescription>
                  Всего пользователей: {users.length}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {users.length === 0 ? (
                  <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4 text-sm leading-7 text-[#6f6156]">
                    Пока нет ни одного пользователя.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => {
                      const generationCount = generationsMap.get(user.id) ?? 0;
                      const spentCredits = spentCreditsMap.get(user.id) ?? 0;

                      return (
                        <div
                          key={user.id}
                          className="rounded-[22px] border border-[#eadfd6] bg-[#fffaf6] p-5 shadow-[0_8px_24px_rgba(95,69,48,0.04)]"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl text-[#3d3128]">
                                  {user.login}
                                </h3>

                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em] ${
                                    user.role === "ADMIN"
                                      ? "bg-[#f3e4d6] text-[#8a6a52]"
                                      : "bg-[#eef3ea] text-[#667257]"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-[#7e6f63] break-all">
                                email:{" "}
                                <span className="font-medium text-[#3d3128]">
                                  {user.email}
                                </span>
                              </p>

                              <p className="mt-1 text-sm text-[#7e6f63]">
                                Зарегистрирован: {formatDate(user.createdAt)}
                              </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="rounded-[18px] border border-[#eadfd6] bg-white px-4 py-3 text-center">
                                <p className="text-xs uppercase tracking-[0.14em] text-[#a18672]">
                                  Генераций
                                </p>
                                <p className="mt-2 text-lg text-[#3d3128]">
                                  {generationCount}
                                </p>
                              </div>

                              <div className="rounded-[18px] border border-[#eadfd6] bg-white px-4 py-3 text-center">
                                <p className="text-xs uppercase tracking-[0.14em] text-[#a18672]">
                                  Потрачено
                                </p>
                                <p className="mt-2 text-lg text-[#3d3128]">
                                  {spentCredits} кр.
                                </p>
                              </div>

                              <div className="rounded-[18px] border border-[#eadfd6] bg-white px-4 py-3 text-center">
                                <p className="text-xs uppercase tracking-[0.14em] text-[#a18672]">
                                  Баланс
                                </p>
                                <p className="mt-2 text-lg text-[#3d3128]">
                                  {user.creditBalance} кр.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
