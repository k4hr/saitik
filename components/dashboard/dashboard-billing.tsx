"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Check, Clock3, Gift } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const creditPacks = [
  {
    name: "Старт",
    subtitle: "Для первого знакомства",
    priceRub: 290,
    credits: 60,
    images: 6,
    featured: false,
  },
  {
    name: "Креатор",
    subtitle: "Для регулярных генераций",
    priceRub: 690,
    credits: 160,
    images: 16,
    featured: false,
  },
  {
    name: "Студия",
    subtitle: "Оптимальный выбор",
    priceRub: 1490,
    credits: 380,
    images: 38,
    featured: true,
    badge: "Лучший выбор",
  },
  {
    name: "Бизнес",
    subtitle: "Максимум выгоды",
    priceRub: 2990,
    credits: 800,
    images: 80,
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
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function formatTimeLeft(targetIso: string | null): string {
  if (!targetIso) {
    return "00:00:00";
  }

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

  const studioPromoPriceRub = 890;
  const studioRegularPriceRub = 1490;
  const studioDiscountRub = studioRegularPriceRub - studioPromoPriceRub;

  return (
    <section className="relative overflow-hidden py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl">
            Пополнить баланс
          </h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            10 кредитов = 1 изображение. Новым пользователям даём бесплатный
            бонус, чтобы можно было протестировать сервис без оплаты.
          </p>
        </div>

        {hasWelcomeOffer ? (
          <div className="mb-8 overflow-hidden rounded-[32px] border border-[#d8c1ad] bg-[linear-gradient(135deg,#fffaf6_0%,#f6ece3_100%)] p-6 shadow-[0_20px_60px_rgba(95,69,48,0.10)] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#f1e4d8] text-[#a07f66]">
                    <Gift className="size-5" />
                  </div>

                  <p className="text-sm uppercase tracking-[0.24em] text-[#a18672]">
                    Предложение для нового пользователя
                  </p>
                </div>

                <h2 className="mt-5 text-3xl leading-tight text-[#3d3128] sm:text-4xl">
                  Вам начислено 10 кредитов за регистрацию
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-8 text-[#6f6156]">
                  Только первый час после регистрации действует специальная
                  цена на тариф <span className="font-medium">Студия</span>.
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-3">
                  <span className="text-xl text-[#9d8470] line-through">
                    {formatRub(studioRegularPriceRub)}
                  </span>
                  <span className="text-4xl font-semibold text-[#2f241d]">
                    {formatRub(studioPromoPriceRub)}
                  </span>
                  <span className="rounded-full bg-[#f1e4d8] px-3 py-1 text-sm text-[#8f6d55]">
                    Выгода {formatRub(studioDiscountRub)}
                  </span>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#eadfd6] bg-white/80 p-6 shadow-[0_12px_30px_rgba(95,69,48,0.05)]">
                <div className="flex items-center gap-3">
                  <Clock3 className="size-5 text-[#a07f66]" />
                  <p className="text-sm uppercase tracking-[0.18em] text-[#a18672]">
                    До конца акции
                  </p>
                </div>

                <p className="mt-4 text-4xl font-semibold tracking-[0.06em] text-[#2f241d]">
                  {timeLeft}
                </p>

                <div className="mt-6">
                  <Button size="lg" className="w-full">
                    Купить тариф Студия
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="relative overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_top_right,rgba(222,207,194,0.65),transparent_32%),linear-gradient(180deg,#2d241f_0%,#4f3f35_38%,#d9c8bb_100%)] px-4 py-8 text-white shadow-[0_24px_80px_rgba(91,67,49,0.10)] sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-120px] top-[80px] h-[280px] w-[280px] rounded-full bg-[#8b6b56]/25 blur-3xl" />
            <div className="absolute right-[-100px] top-[-40px] h-[360px] w-[360px] rounded-full bg-[#d8c0ad]/20 blur-3xl" />
            <div className="absolute bottom-[-120px] left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[#f4ebe4]/15 blur-3xl" />
          </div>

          <div className="relative">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.26em] text-[#ead6c7]">
                Тарифы
              </p>

              <h2 className="mt-4 text-4xl leading-[1.02] text-white sm:text-5xl">
                Кредиты для генерации фотосессий
              </h2>

              <p className="mt-5 text-base leading-8 text-white/78 sm:text-lg">
                Подберите удобный пакет для генераций.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-4">
              {creditPacks.map((pack) => {
                const isPromoStudio = hasWelcomeOffer && pack.name === "Студия";
                const actualPriceRub = isPromoStudio
                  ? studioPromoPriceRub
                  : pack.priceRub;

                return (
                  <div
                    key={pack.name}
                    className={`relative rounded-[32px] border p-7 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm ${
                      pack.featured
                        ? "border-[#d9b392] bg-[#fff9f4] text-[#2f241d]"
                        : "border-white/12 bg-white/92 text-[#2f241d]"
                    }`}
                  >
                    {pack.featured && pack.badge ? (
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bc9670] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(95,69,48,0.20)]">
                        {pack.badge}
                      </div>
                    ) : null}

                    <h3 className="text-3xl italic text-[#2f241d]">{pack.name}</h3>
                    <p className="mt-2 text-lg text-[#6e5d51]">{pack.subtitle}</p>

                    <div className="mt-7">
                      {isPromoStudio ? (
                        <div className="space-y-2">
                          <p className="text-xl text-[#9d8470] line-through">
                            {formatRub(studioRegularPriceRub)}
                          </p>
                          <p className="text-5xl font-semibold tracking-tight text-[#1f1712]">
                            {formatRub(actualPriceRub)}
                          </p>
                          <p className="text-sm text-[#9d8470]">
                            Только для новых пользователей
                          </p>
                        </div>
                      ) : (
                        <p className="text-5xl font-semibold tracking-tight text-[#1f1712]">
                          {formatRub(actualPriceRub)}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-[#2f241d]">
                      <Sparkles className="size-5 text-[#bc9670]" />
                      <p className="text-2xl font-medium">
                        {pack.credits} кредитов
                      </p>
                    </div>

                    <div className="mt-7 border-t border-[#eadfd6] pt-5">
                      <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#9d8470]">
                        Хватит на
                      </p>

                      <div className="mt-4 flex items-center gap-3 text-[#2f241d]">
                        <div className="flex size-6 items-center justify-center rounded-full bg-[#bc9670] text-white">
                          <Check className="size-4" />
                        </div>
                        <p className="text-lg">{pack.images} изображений</p>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-[#6e5d51]">
                        Стандартная генерация: 1 фото = 10 кредитов.
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className={`mt-8 w-full ${
                        pack.featured
                          ? "bg-[#bc9670] text-[#2f241d] hover:bg-[#b18861]"
                          : "bg-[#2f241d] text-white hover:bg-[#241b16]"
                      }`}
                    >
                      Купить
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Card className="mt-8 rounded-[30px] border border-[#eadfd6] bg-[#fffaf6] shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
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
      </Container>
    </section>
  );
}
