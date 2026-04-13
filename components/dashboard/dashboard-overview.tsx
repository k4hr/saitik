import Link from "next/link";
import { CreditCard, ImageIcon, Sparkles, Wallet } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Баланс", value: "150 credits", icon: Wallet },
  { label: "Заказы", value: "4", icon: ImageIcon },
  { label: "Готово", value: "3", icon: Sparkles },
  { label: "Платежи", value: "2", icon: CreditCard },
];

export default function DashboardOverview() {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">Dashboard</p>
          <h1 className="mt-4 text-4xl leading-[1.06] sm:text-5xl">Личный кабинет ATELIA</h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            Здесь пользователь смотрит баланс кредитов, свои фотосессии, статусы генераций и историю пополнений.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="bg-white/90">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#7e6f63]">{item.label}</p>
                    <Icon className="size-4 text-[#a18672]" />
                  </div>
                  <p className="mt-4 text-3xl text-[#3d3128]">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>
                Нужные действия в одном месте: новый заказ, каталог стилей и пополнение баланса.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <Button asChild size="lg">
                <Link href="/create">Создать заказ</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/styles">Каталог стилей</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/dashboard/billing">Пополнить кредиты</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#fffaf6]">
            <CardHeader>
              <CardTitle>Следующий шаг</CardTitle>
              <CardDescription>
                После подключения auth и Prisma сюда подставятся реальные данные пользователя.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-[#7e6f63]">
              • email-авторизация<br />
              • баланс кредитов<br />
              • последние заказы<br />
              • платежная история
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
