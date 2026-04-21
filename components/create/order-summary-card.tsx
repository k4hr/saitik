"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SummaryStyle = {
  id?: string;
  title: string;
  category?: string;
  description?: string;
  promptTemplate?: string | null;
  coverImageUrl?: string | null;
  generationPriceCredits?: number | null;
};

type OrderSummaryCardProps = {
  selectedStyle?: SummaryStyle;
  submitText: string;
  onSubmit: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  currentBalance?: number | null;
};

export default function OrderSummaryCard({
  selectedStyle,
  submitText,
  onSubmit,
  disabled,
  isSubmitting,
  currentBalance,
}: OrderSummaryCardProps) {
  const price = selectedStyle?.generationPriceCredits ?? 0;
  const hasBalanceInfo = typeof currentBalance === "number";
  const insufficientCredits =
    hasBalanceInfo && price > 0 ? currentBalance < price : false;

  return (
    <Card className="sticky top-24 overflow-hidden rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_14px_36px_rgba(95,69,48,0.06)]">
      <CardContent className="p-0">
        <div className="aspect-[0.82] overflow-hidden bg-[#efe3d7]">
          {selectedStyle?.coverImageUrl ? (
            <img
              src={selectedStyle.coverImageUrl}
              alt={selectedStyle.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
              Выбранный стиль
            </p>
            <h3 className="mt-3 text-3xl leading-tight text-[#3d3128]">
              {selectedStyle?.title || "Стиль"}
            </h3>
          </div>

          <div className="rounded-[22px] border border-[#eadfd6] bg-[#fffaf6] px-4 py-4">
            <p className="text-sm text-[#7e6f63]">Цена</p>
            <p className="mt-2 text-2xl text-[#3d3128]">{price} кредитов</p>
          </div>

          {hasBalanceInfo ? (
            <div className="rounded-[22px] border border-[#eadfd6] bg-[#fffaf6] px-4 py-4">
              <p className="text-sm text-[#7e6f63]">Баланс</p>
              <p className="mt-2 text-2xl text-[#3d3128]">
                {currentBalance} кредитов
              </p>

              {insufficientCredits ? (
                <p className="mt-3 text-sm leading-6 text-[#a05d50]">
                  Недостаточно кредитов для генерации.
                </p>
              ) : null}
            </div>
          ) : null}

          <Button
            size="xl"
            className="w-full"
            onClick={onSubmit}
            disabled={disabled || isSubmitting || insufficientCredits}
          >
            {isSubmitting ? "Генерируем..." : submitText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
