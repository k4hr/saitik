"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Wallet,
  Shield,
  Clock3,
  Gift,
  Settings,
} from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type DashboardOverviewProps = {
  login: string;
  balance: number;
  isAdmin: boolean;
  welcomeOfferEndsAt: string | null;
};

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

export default function DashboardOverview({
  login,
  balance,
  isAdmin,
  welcomeOfferEndsAt,
}: DashboardOverviewProps) {
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(welcomeOfferEndsAt));

  useEffect(() => {
    if (!welcomeOfferEndsAt) return;

    const tick = () => setTimeLeft(formatTimeLeft(welcomeOfferEndsAt));

    tick();
    const timer = window.setInterval(tick, 1000);

    return () => window.clearInterval(timer);
  }, [welcomeOfferEndsAt]);

  const showWelcomeBanner = useMemo(() => {
    if (!welcomeOfferEndsAt) return false;
    return new Date(welcomeOfferEndsAt).getTime() > Date.now();
  }, [welcomeOfferEndsAt]);

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mx-auto max-w-6xl rounded-[34px] border border-white/60 bg-white/45 p-6 shadow-[0_24px_80px_rgba(91,67,49,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Личный кабинет
          </p>

          <h1 className="mt-4 text-4xl leading-[1.04] text-[#3d3128] sm:text-5xl">
            Привет, {login}
          </h1>

          {showWelcomeBanner ? (
            <div className="mt-8 overflow-hidden rounded-[32px] border border-[#d8c1ad] bg-[linear-gradient(135deg,#fffaf6_0%,#f6ece3_100%)] p-6 shadow-[0_18px_50px_rgba(95,69,48,0.10)] sm:p-8">
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
                    <Button asChild size="lg" className="w-full">
                      <Link href="/dashboard/billing">Купить тариф Студия</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[30px] border border-[#eadfd6] bg-white/90 p-6 shadow-[0_14px_36px_rgba(95,69,48,0.06)] sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#f1e4d8] text-[#a07f66]">
                  <Sparkles className="size-5" />
                </div>

                <div>
                  <p className="text-sm text-[#7e6f63]">Быстрый старт</p>
                  <p className="mt-1 text-2xl text-[#3d3128]">
                    Создай новую фотосессию
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6f6156]">
                Выбери готовый стиль или зайди в режим по своему референсу,
                загрузи фото и получи готовый результат.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/styles">Выбрать стиль</Link>
                </Button>

                <Button asChild variant="secondary" size="lg">
                  <Link href="/dashboard/orders">Мои заказы</Link>
                </Button>

                <Button asChild variant="secondary" size="lg">
                  <Link href="/dashboard/settings">
                    <Settings className="size-4.5" />
                    Настройки
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[30px] border border-[#eadfd6] bg-white/90 p-6 shadow-[0_14px_36px_rgba(95,69,48,0.06)] sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#f1e4d8] text-[#a07f66]">
                    <Wallet className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm text-[#7e6f63]">Баланс</p>
                    <p className="mt-1 text-3xl text-[#3d3128]">
                      {balance} кредитов
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/dashboard/billing">Пополнить баланс</Link>
                  </Button>
                </div>
              </div>

              {isAdmin ? (
                <div className="rounded-[30px] border border-[#eadfd6] bg-white/90 p-6 shadow-[0_14px_36px_rgba(95,69,48,0.06)] sm:p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#f1e4d8] text-[#a07f66]">
                      <Shield className="size-5" />
                    </div>

                    <div>
                      <p className="text-sm text-[#7e6f63]">Админка</p>
                      <p className="mt-1 text-2xl text-[#3d3128]">
                        Управление витриной
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      asChild
                      variant="secondary"
                      size="lg"
                      className="w-full"
                    >
                      <Link href="/dashboard/admin">Открыть админ меню</Link>
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
