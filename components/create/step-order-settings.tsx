"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formatOptions = [
  "Портрет",
  "По пояс",
  "В полный рост",
  "Lifestyle",
  "Dating",
  "Business"
];

const moodOptions = [
  "Мягкий свет",
  "Luxury",
  "Natural",
  "Editorial",
  "Clean studio",
  "Travel vibe"
];

type StepOrderSettingsProps = {
  selectedFormat: string;
  selectedMood: string;
  onFormatSelect: (value: string) => void;
  onMoodSelect: (value: string) => void;
};

export default function StepOrderSettings({
  selectedFormat,
  selectedMood,
  onFormatSelect,
  onMoodSelect
}: StepOrderSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
          Шаг 4
        </p>
        <h2 className="mt-3 text-3xl text-[#3d3128]">Настройки заказа</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7e6f63]">
          Здесь пользователь задает цель фотосессии, формат кадров и свои пожелания.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Параметры генерации</CardTitle>
          <CardDescription>
            Позже этот шаг легко подключится к серверному payload для создания заказа.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-[#6f6156]">Название заказа</span>
              <Input placeholder="Например: Dating photos / Soft Pinterest set" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[#6f6156]">Цель</span>
              <Input placeholder="Instagram, Tinder, LinkedIn, личный бренд" />
            </label>
          </div>

          <div>
            <p className="mb-3 text-sm text-[#6f6156]">Формат кадров</p>
            <div className="flex flex-wrap gap-2">
              {formatOptions.map((item) => {
                const active = selectedFormat === item;

                return (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? "bg-[#b79273] text-white"
                        : "border border-[#d8c5b7] text-[#5f5248] hover:bg-[#efe4db]"
                    }`}
                    onClick={() => onFormatSelect(item)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-[#6f6156]">Настроение / вайб</p>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((item) => {
                const active = selectedMood === item;

                return (
                  <button
                    key={item}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? "bg-[#b79273] text-white"
                        : "border border-[#d8c5b7] text-[#5f5248] hover:bg-[#efe4db]"
                    }`}
                    onClick={() => onMoodSelect(item)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm text-[#6f6156]">
              Пожелания к результату
            </span>
            <Textarea placeholder="Например: хочу дорогой мягкий свет, натуральное лицо, больше кадров по пояс, без сильной ретуши." />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
