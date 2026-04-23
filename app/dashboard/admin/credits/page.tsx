import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { WalletCards } from "lucide-react";
import { CreditTransactionType } from "@prisma/client";

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

type SearchParams = Promise<{
  success?: string;
  error?: string;
}>;

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function AdminCreditsPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const searchParams = (await props.searchParams) ?? {};
  const successText =
    searchParams.success === "1"
      ? "Кредиты успешно начислены."
      : "";
  const errorText =
    searchParams.error === "invalid"
      ? "Проверь логин и количество кредитов."
      : searchParams.error === "notfound"
        ? "Пользователь с таким логином не найден."
        : "";

  async function grantCreditsAction(formData: FormData) {
    "use server";

    const adminSession = await getSession();

    if (!adminSession || adminSession.role !== "ADMIN") {
      redirect("/dashboard");
    }

    const login = String(formData.get("login") || "")
      .trim()
      .toLowerCase();
    const amount = Number(String(formData.get("amount") || "").trim());
    const description = String(formData.get("description") || "").trim();

    if (!login || !Number.isInteger(amount) || amount <= 0) {
      redirect("/dashboard/admin/credits?error=invalid");
    }

    const user = await prisma.user.findUnique({
      where: { login },
      select: {
        id: true,
        creditBalance: true,
      },
    });

    if (!user) {
      redirect("/dashboard/admin/credits?error=notfound");
    }

    const balanceAfter = user.creditBalance + amount;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          creditBalance: balanceAfter,
        },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: user.id,
          type: CreditTransactionType.ADMIN_ADJUSTMENT,
          amount,
          balanceAfter,
          description:
            description || `Начисление кредитов администратором`,
        },
      }),
    ]);

    revalidatePath("/dashboard/admin/credits");
    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/billing");

    redirect("/dashboard/admin/credits?success=1");
  }

  const lastAdjustments = await prisma.creditTransaction.findMany({
    where: {
      type: CreditTransactionType.ADMIN_ADJUSTMENT,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    select: {
      id: true,
      amount: true,
      balanceAfter: true,
      description: true,
      createdAt: true,
      user: {
        select: {
          login: true,
          email: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      <section className="py-12 sm:py-14 lg:py-18">
        <Container>
          <div className="mx-auto max-w-6xl rounded-[32px] border border-white/60 bg-white/45 p-6 shadow-[0_24px_80px_rgba(91,67,49,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#bc9670] text-white shadow-[0_10px_24px_rgba(95,69,48,0.18)]">
                <WalletCards className="size-5" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                  Админ меню
                </p>
                <h1 className="mt-1 text-4xl leading-[1.06] sm:text-5xl">
                  Начислить кредиты
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#726458] sm:text-lg">
              Начисление кредитов пользователю по логину. Операция сразу
              сохраняется в историю.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                type="button"
                size="xl"
                className="pointer-events-none rounded-[22px] bg-[#bc9670] text-[#2f241d]"
              >
                Начисление кредитов
              </Button>

              <Button asChild variant="secondary" size="xl">
                <Link href="/dashboard/admin">Назад в админ меню</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[430px_1fr]">
              <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
                <CardHeader>
                  <CardTitle>Начислить пользователю</CardTitle>
                  <CardDescription>
                    Введи логин пользователя и количество кредитов.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {successText ? (
                    <div className="mb-4 rounded-[18px] border border-[#d8e8d5] bg-[#f5fbf3] px-4 py-3 text-sm text-[#4f7a4c]">
                      {successText}
                    </div>
                  ) : null}

                  {errorText ? (
                    <div className="mb-4 rounded-[18px] border border-[#e7c7bf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4f43]">
                      {errorText}
                    </div>
                  ) : null}

                  <form action={grantCreditsAction} className="space-y-4">
                    <div>
                      <label
                        htmlFor="login"
                        className="mb-2 block text-sm text-[#6f6156]"
                      >
                        Логин пользователя
                      </label>
                      <input
                        id="login"
                        name="login"
                        type="text"
                        required
                        placeholder="Например: atelia_user"
                        className="h-14 w-full rounded-[18px] border border-[#d8c5b7] bg-white px-4 text-base outline-none transition focus:border-[#bc9670]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="amount"
                        className="mb-2 block text-sm text-[#6f6156]"
                      >
                        Количество кредитов
                      </label>
                      <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="1"
                        step="1"
                        required
                        placeholder="Например: 100"
                        className="h-14 w-full rounded-[18px] border border-[#d8c5b7] bg-white px-4 text-base outline-none transition focus:border-[#bc9670]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="mb-2 block text-sm text-[#6f6156]"
                      >
                        Комментарий
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Например: бонус за тест, ручное начисление, компенсация"
                        className="w-full rounded-[18px] border border-[#d8c5b7] bg-white px-4 py-3 text-base outline-none transition focus:border-[#bc9670]"
                      />
                    </div>

                    <Button type="submit" size="xl" className="w-full">
                      Начислить кредиты
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
                <CardHeader>
                  <CardTitle>Последние начисления</CardTitle>
                  <CardDescription>
                    История последних админских начислений кредитов.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {lastAdjustments.length === 0 ? (
                    <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4 text-sm leading-7 text-[#6f6156]">
                      Пока нет ни одного начисления.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lastAdjustments.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-[22px] border border-[#eadfd6] bg-[#fffaf6] p-5 shadow-[0_8px_24px_rgba(95,69,48,0.04)]"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-base text-[#3d3128]">
                                {item.user.login}
                              </p>
                              <p className="mt-1 break-all text-sm text-[#7e6f63]">
                                {item.user.email}
                              </p>
                              <p className="mt-1 text-sm text-[#7e6f63]">
                                {formatDate(item.createdAt)}
                              </p>
                              {item.description ? (
                                <p className="mt-3 text-sm leading-7 text-[#6f6156]">
                                  {item.description}
                                </p>
                              ) : null}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-[18px] border border-[#eadfd6] bg-white px-4 py-3 text-center">
                                <p className="text-xs uppercase tracking-[0.14em] text-[#a18672]">
                                  Начислено
                                </p>
                                <p className="mt-2 text-lg text-[#3d3128]">
                                  +{item.amount} кр.
                                </p>
                              </div>

                              <div className="rounded-[18px] border border-[#eadfd6] bg-white px-4 py-3 text-center">
                                <p className="text-xs uppercase tracking-[0.14em] text-[#a18672]">
                                  Баланс после
                                </p>
                                <p className="mt-2 text-lg text-[#3d3128]">
                                  {item.balanceAfter} кр.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
