import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EmailSignInCard() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Вход по email</CardTitle>
          <CardDescription>
            Для генерации пользователь сначала входит в аккаунт. После входа у него
            появляется личный кабинет, баланс кредитов и история заказов.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-[#6f6156]">Email</span>
            <Input type="email" placeholder="you@example.com" />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg">
              <Mail className="size-4" />
              Отправить код
            </Button>
            <Button variant="secondary" size="lg">
              Ввести код
            </Button>
          </div>

          <p className="text-sm leading-7 text-[#7e6f63]">
            Сейчас это готовая UI-страница. Следующим шагом подключим реальную отправку
            кода на почту и серверную проверку.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#fffaf6]">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-[#a18672]">
            <ShieldCheck className="size-4" />
            Что получает пользователь
          </div>
          <CardTitle className="mt-2">Личный кабинет</CardTitle>
          <CardDescription>
            После входа все заказы и кредиты уже привязаны к email-аккаунту.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-[#7e6f63]">
          <p>• История заказов и результатов</p>
          <p>• Баланс кредитов</p>
          <p>• Платежи и пополнения</p>
          <p>• Быстрый повтор генерации</p>

          <Button asChild variant="secondary" size="lg" className="mt-2 w-full">
            <Link href="/dashboard">Посмотреть кабинет</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
