import Link from "next/link";
import {
  CreditCard,
  ImageIcon,
  Settings,
  Shield,
  Wallet,
} from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashboardOverviewProps = {
  login: string;
  balance: number;
  isAdmin?: boolean;
};

const actions = [
  {
    title: "Мои генерации",
    href: "/dashboard/orders",
    icon: ImageIcon,
  },
  {
    title: "Пополнить баланс",
    href: "/dashboard/billing",
    icon: Wallet,
  },
  {
    title: "История транзакций",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Настройки",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardOverview({
  login,
  balance,
  isAdmin = false,
}: DashboardOverviewProps) {
  return (
    <section className="relative py-12 sm:py-14 lg:py-18">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[6%] top-[20px] h-[220px] w-[220px] rounded-full bg-[#efe2d7]/65 blur-3xl" />
        <div className="absolute right-[8%] top-[60px] h-[240px] w-[240px] rounded-full bg-[#ead8c9]/55 blur-3xl" />
        <div className="absolute bottom-[-40px] left-[28%] h-[220px] w-[220px] rounded-full bg-[#f3e8de]/80 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-white/60 bg-white/45 p-6 shadow-[0_24px_80px_rgba(91,67,49,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
          <h1 className="text-4xl leading-[1.02] text-[#3d3128] sm:text-5xl">
            Личный кабинет ATELIA
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#6f6156] sm:text-xl">
            Здравствуйте, {login}
          </p>

          <Card className="mt-8 overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.82)_0%,rgba(255,248,242,0.72)_100%)] shadow-[0_18px_50px_rgba(95,69,48,0.10)]">
            <CardContent className="p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.20em] text-[#a18672]">
                Баланс
              </p>
              <p className="mt-4 text-4xl leading-none text-[#3d3128] sm:text-5xl">
                {balance} credits
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Button
                  key={action.title}
                  asChild
                  variant="secondary"
                  size="xl"
                  className="group h-auto w-full justify-between rounded-[26px] border border-white/70 bg-white/55 px-6 py-6 text-left text-[#3d3128] shadow-[0_16px_40px_rgba(95,69,48,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_22px_50px_rgba(95,69,48,0.12)]"
                >
                  <Link
                    href={action.href}
                    className="flex w-full items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-full border border-white/70 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                        <Icon className="size-5 text-[#9f7f67]" />
                      </div>
                      <span className="text-base font-medium sm:text-lg">
                        {action.title}
                      </span>
                    </div>
                  </Link>
                </Button>
              );
            })}
          </div>

          {isAdmin ? (
            <div className="mt-8">
              <Button
                asChild
                size="xl"
                className="h-auto rounded-[24px] bg-[#bc9670] px-6 py-5 text-[#2f241d] shadow-[0_16px_40px_rgba(95,69,48,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b38b64] hover:shadow-[0_22px_52px_rgba(95,69,48,0.22)]"
              >
                <Link href="/dashboard/admin" className="flex items-center gap-3">
                  <Shield className="size-5" />
                  <span className="text-base font-medium sm:text-lg">
                    Админ меню
                  </span>
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
