"use client";

import { CheckCircle2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SummaryStyle = {
  id?: string;
  title: string;
  category: string;
  description?: string;
  promptTemplate?: string | null;
  coverImageUrl?: string | null;
};

type OrderSummaryCardProps = {
  selectedStyle?: SummaryStyle;
  selectedFormat: string;
  selectedMood: string;
  modeLabel: string;
  submitText: string;
  onSubmit: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
};

export default function OrderSummaryCard({
  selectedStyle,
  selectedFormat,
  selectedMood,
  modeLabel,
  submitText,
  onSubmit,
  disabled,
  isSubmitting,
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
          {selectedStyle?.title ?? modeLabel}
        </CardTitle>

        <CardDescription>
          После запуска создаётся заказ, OpenAI генерирует картинку, результат
          сохраняется в R2 и сразу показывается пользователю.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant={selectedStyle ? "selected" : "outline"}>
            {selectedStyle?.category ?? modeLabel}
          </Badge>
          <Badge variant="ivory">{selectedFormat}</Badge>
          <Badge variant="ivory">{selectedMood}</Badge>
        </div>

        <div className="space-y-3 rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-[#a18672]" />
            <div>
              <p className="text-sm text-[#3d3128]">Upload → R2</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                Исходники сразу уходят в Cloudflare.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-[#a18672]" />
            <div>
              <p className="text-sm text-[#3d3128]">OpenAI generation</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                Генерация идёт через API и сохраняется в заказ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 text-[#a18672]" />
            <div>
              <p className="text-sm text-[#3d3128]">Скачать и поделиться</p>
              <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                У результата есть download и share-ссылка на твой сайт.
              </p>
            </div>
          </div>
        </div>

        <Button
          size="xl"
          className="w-full"
          onClick={onSubmit}
          disabled={disabled || isSubmitting}
        >
          {isSubmitting ? "Генерируем..." : submitText}
        </Button>
      </CardContent>
    </Card>
  );
}
