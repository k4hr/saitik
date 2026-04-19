"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Gift } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const packs = [
  {
    key: "start",
    title: "60 кредитов",
    priceRub: 290,
    note: "Старт · 6 изображений",
    featured: false,
  },
  {
    key: "creator",
    title: "160 кредитов",
    priceRub: 690,
    note: "Креатор · 16 изображений",
    featured: false,
  },
  {
    key: "studio",
    title: "380 кредитов",
    priceRub: 1490,
    note: "Студия · 38 изображений",
    featured: true,
  },
  {
    key: "business",
    title: "800 кредитов",
    priceRub: 2990,
    note: "Бизнес · 80 изображений",
    featured: false,
  },
] as const;

type TransactionItem = {
  id: string;
  credits: number;
  amountRub: number;
  dateLabel: string;
};

type DashboardBillingProps = {
  transactions: TransactionItem[];
  welcomeOfferEndsAt?: string | null;
};

function formatRub(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function formatTimeLeft(targetIso: string | null): string {
  if (!targetIso) return "00:00:00";

  const diff = new Date(targetIso).getTime() - Date.now();

  if (diff <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function DashboardBilling({
  transactions,
  welcomeOfferEndsAt = null,
}: DashboardBillingProps) {
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(welcomeOfferEndsAt));

  useEffect(() => {
    if (!welcomeOfferEndsAt) return;

    const tick = () => setTimeLeft(formatTimeLeft(welcomeOfferEndsAt));

    tick();
    const timer = window.setInterval(tick, 1000);

    return () => window.clearInterval(timer);
  }, [welcomeOfferEndsAt]);

  const hasWelcomeOffer = useMemo(() => {
    if (!welcomeOfferEndsAt) return false;
    return new Date(welcomeOfferEndsAt).getTime() > Date.now();
  }, [welcomeOfferEndsAt]);

  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl">
            Пополнить баланс
          </h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            10 кредитов = 1 изображение. После регистрации пользователь получает
            10 бесплатных кредитов, чтобы попробовать 1 генерацию без оплаты.
          </p>
        </div>

        {hasWelcomeOffer ? (
          <div className="mb-8 overflow-hidden rounded-[30px] border border-[#d8c1ad] bg-[linear-gradient(135deg,#fffaf6_0%,#f6ece3_100%)] p-6 shadow-[0_18px_50px_rgba(95,69,48,0.10)] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#f1e4d8] text-[#a07f66]">
                    <Gift className="size-5" />
                  </div>

                  <p className="text-sm uppercase tracking-[0.22em] text-[#a18672]">
                    Welcome offer
                  </p>
                </div>

                <h2 className="mt-5 text-3xl leading-tight text-[#3d3128] sm:text-4xl">
                  Тариф Студия сейчас по специальной цене
                </h2>

                <div className="mt-6 flex flex-wrap items-end gap-3">
                  <span className="text-lg text-[#9d8470] line-through">
                    1 490 ₽
                  </span>
                  <span className="text-4xl font-semibold text-[#2f241d]">
                    890 ₽
                  </span>
                  <span className="rounded-full bg-[#f1e4d8] px-3 py-1 text-sm text-[#8f6d55]">
                    Выгода 600 ₽
                  </span>
                </div>
              </div>

              <div className="rounded-[26px] border border-[#eadfd6] bg-white/80 p-6">
                <div className="flex items-center gap-3">
                  <Clock3 className="size-5 text-[#a07f66]" />
                  <p className="text-sm uppercase tracking-[0.18em] text-[#a18672]">
                    До конца акции
                  </p>
                </div>

                <p className="mt-4 text-4xl font-semibold tracking-[0.06em] text-[#2f241d]">
                  {timeLeft}
                </p>

                <Button size="lg" className="mt-6 w-full">
                  Купить Студию за 890 ₽
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card className="rounded-[30px] border border-[#eadfd6] bg-white/85 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
            <CardHeader>
              <CardTitle>Выберите пакет</CardTitle>
              <CardDescription>
                Подберите удобный объём кредитов для генерации фотосессий.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {packs.map((pack) => {
                const isPromoStudio = hasWelcomeOffer && pack.key === "studio";
                const finalPriceRub = isPromoStudio ? 890 : pack.priceRub;

                return (
                  <div
                    key={pack.key}
                    className={`rounded-[24px] border p-5 shadow-[0_10px_30px_rgba(95,69,48,0.05)] ${
                      pack.featured
                        ? "border-[#caa789] bg-[#fff7f1]"
                        : "border-[#eadfd6] bg-[#fffaf6]"
                    }`}
                  >
                    {pack.featured ? (
                      <span className="inline-flex rounded-full bg-[#f1e0d1] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#9a7658]">
                        Лучший выбор
                      </span>
                    ) : null}

                    <p className="mt-3 text-sm text-[#a18672]">{pack.note}</p>
                    <h2 className="mt-3 text-2xl text-[#3d3128]">{pack.title}</h2>

                    {isPromoStudio ? (
                      <div className="mt-2">
                        <p className="text-sm text-[#9d8470] line-through">
                          {formatRub(pack.priceRub)}
                        </p>
                        <p className="mt-1 text-lg text-[#3d3128]">
                          {formatRub(finalPriceRub)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-lg text-[#3d3128]">
                        {formatRub(finalPriceRub)}
                      </p>
                    )}

                    <p className="mt-4 text-sm leading-7 text-[#7e6f63]">
                      Стандартная генерация списывает 10 кредитов за 1 изображение.
                    </p>

                    <Button size="lg" className="mt-5 w-full">
                      Купить
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border border-[#eadfd6] bg-[#fffaf6] shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
            <CardHeader>
              <CardTitle>История транзакций</CardTitle>
              <CardDescription>
                Здесь отображаются все пополнения баланса пользователя.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {transactions.length === 0 ? (
                <div className="rounded-[20px] border border-[#eadfd6] bg-white p-4 text-sm text-[#7e6f63]">
                  Пока нет ни одного пополнения.
                </div>
              ) : (
                transactions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-[#eadfd6] bg-white p-4 shadow-[0_8px_24px_rgba(95,69,48,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#3d3128]">
                          Пополнение баланса
                        </p>
                        <p className="mt-1 text-xs text-[#8f7f73]">
                          {item.dateLabel}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-[#3d3128]">
                          +{item.credits} credits
                        </p>
                        <p className="mt-1 text-xs text-[#8f7f73]">
                          {formatRub(item.amountRub)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
