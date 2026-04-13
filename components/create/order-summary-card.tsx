"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StyleOption } from "@/lib/data/style-presets";

type OrderSummaryCardProps = {
  selectedStyle?: StyleOption;
  selectedFormat: string;
  selectedMood: string;
};

export default function OrderSummaryCard({
  selectedStyle,
  selectedFormat,
  selectedMood,
}: OrderSummaryCardProps) {
  return (
    <Card className="sticky top-24 overflow-hidden">
      <div className="aspect-[1.2] bg-[linear-gradient(180deg,#e2d2c5_0%,#f4ece6_100%)]" />

      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-[#a18672]">
          <Sparkles className="size-4" />
          Сводка заказа
        </div>

        <CardTitle className="mt-2">{selectedStyle?.title ?? "Выбери стиль"}</CardTitle>

        <CardDescription>
          Здесь пользователь увидит краткую сводку перед списанием кредитов и запуском генерации.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant={selectedStyle ? "selected" : "outline"}>
            {selectedStyle?.category ?? "Без категории"}
          </Badge>
          <Badge variant="ivory">{selectedFormat}</Badge>
          <Badge variant="ivory">{selectedMood}</Badge>
        </div>

        <div className="space-y-3 rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-[#a18672]" />
            <div>
              <p className="text-sm text-[#3d3128]">Готовый стиль — 40 кредитов</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                Базовая генерация по каталогу ATELIA.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-[#a18672]" />
            <div>
              <p className="text-sm text-[#3d3128]">Референс — +30 кредитов</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                Доплата, если пользователь загружает свою картинку.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-[#a18672]" />
            <div>
              <p className="text-sm text-[#3d3128]">Reroll и upscale отдельно</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                Позже легко подключим дополнительные действия по кредитам.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eadfd6] bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#7e6f63]">
              <Wallet className="size-4" />
              Баланс пользователя
            </div>
            <p className="text-xl text-[#3d3128]">150 credits</p>
          </div>
          <p className="mt-2 text-xs leading-6 text-[#8f7f73]">
            Для MVP это пока UI-заглушка. Следом сюда подключим реальные данные пользователя.
          </p>
        </div>

        <div className="grid gap-3">
          <Button size="xl">Запустить за кредиты</Button>
          <Button asChild variant="secondary" size="xl">
            <Link href="/dashboard/billing">Пополнить баланс</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
