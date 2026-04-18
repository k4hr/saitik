"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type StepOrderSettingsProps = {
  title: string;
  notes: string;
  onTitleChange: (value: string) => void;
  onNotesChange: (value: string) => void;
};

export default function StepOrderSettings({
  title,
  notes,
  onTitleChange,
  onNotesChange,
}: StepOrderSettingsProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
          Шаг 3
        </p>
        <h2 className="mt-3 text-3xl leading-tight text-[#3d3128] sm:text-4xl">
          Настройки заказа
        </h2>
      </div>

      <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_14px_36px_rgba(95,69,48,0.06)]">
        <CardHeader>
          <CardTitle>Параметры заказа</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <label
              htmlFor="order-title"
              className="mb-2 block text-sm font-medium text-[#6f6156]"
            >
              Название заказа
            </label>
            <Input
              id="order-title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Например: Old Money Girl 1"
            />
          </div>

          <div>
            <label
              htmlFor="order-notes"
              className="mb-2 block text-sm font-medium text-[#6f6156]"
            >
              Пожелания к заказу
            </label>
            <Textarea
              id="order-notes"
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              className="min-h-[150px]"
              placeholder="Например: хочу мягкий свет, дорогой чистый образ, натуральное лицо, без сильной ретуши."
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
