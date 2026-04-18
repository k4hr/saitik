"use client";

import Link from "next/link";
import { Sparkles, Wallet, Shield } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type DashboardOverviewProps = {
  login: string;
  balance: number;
  isAdmin: boolean;
};

export default function DashboardOverview({
  login,
  balance,
  isAdmin,
}: DashboardOverviewProps) {
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
                    <Link href="/pricing">Пополнить баланс</Link>
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
                    <Button asChild variant="secondary" size="lg" className="w-full">
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
