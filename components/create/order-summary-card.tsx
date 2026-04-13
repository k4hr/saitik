"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StyleOption } from "@/components/create/step-style-picker";

type OrderSummaryCardProps = {
  selectedStyle?: StyleOption;
  selectedFormat: string;
  selectedMood: string;
};

export default function OrderSummaryCard({
  selectedStyle,
  selectedFormat,
  selectedMood
}: OrderSummaryCardProps) {
  return (
    <Card className="sticky top-24 overflow-hidden">
      <div className="aspect-[1.2] bg-[linear-gradient(180deg,#e2d2c5_0%,#f4ece6_100%)]" />

      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-[#a18672]">
          <Sparkles className="size-4" />
          Сводка заказа
        </div>

        <CardTitle className="mt-2">
          {selectedStyle?.title ?? "Выбери стиль"}
        </CardTitle>

        <CardDescription>
          Здесь пользователь увидит краткую сводку перед оплатой.
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
              <p className="text-sm text-[#3d3128]">8–20 готовых фото</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                В зависимости от выбранного тарифа и сценария.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-[#a18672]" />
            <div>
              <p className="text-sm text-[#3d3128]">Поддержка референса</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                Можно выбрать шаблон или свой Pinterest-референс.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-[#a18672]" />
            <div>
              <p className="text-sm text-[#3d3128]">Премиальная подача</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                UI уже готов под подключение реальной логики оплаты и генерации.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#eadfd6] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#7e6f63]">Стартовый пакет</p>
            <p className="text-xl text-[#3d3128]">990 ₽</p>
          </div>
          <p className="mt-2 text-xs leading-6 text-[#8f7f73]">
            Для MVP это просто визуальный блок. Дальше сюда подключим выбор тарифа.
          </p>
        </div>

        <div className="grid gap-3">
          <Button size="xl">Перейти к оплате</Button>
          <Button asChild variant="secondary" size="xl">
            <Link href="/styles">Вернуться к стилям</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
