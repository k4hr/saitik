"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StyleOption = {
  id: string;
  title: string;
  category: string;
  description: string;
};

type StepStylePickerProps = {
  items: StyleOption[];
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
};

export default function StepStylePicker({
  items,
  selectedStyleId,
  onSelectStyle
}: StepStylePickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
          Шаг 1
        </p>
        <h2 className="mt-3 text-3xl text-[#3d3128]">Выбери стиль</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7e6f63]">
          Можно выбрать готовую эстетику из каталога. На следующем этапе позже
          легко добавим переход к реальной генерации и сохранению в базу.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const selected = item.id === selectedStyleId;

          return (
            <Card
              key={item.id}
              className={cn(
                "group overflow-hidden transition",
                selected
                  ? "border-[#caa789] shadow-[0_18px_60px_rgba(122,84,55,0.10)]"
                  : "hover:-translate-y-1"
              )}
            >
              <div
                className={cn(
                  "relative aspect-[1/1.14]",
                  index % 3 === 0
                    ? "bg-[linear-gradient(180deg,#dac7b8_0%,#f3ebe5_100%)]"
                    : index % 3 === 1
                      ? "bg-[linear-gradient(180deg,#e8ddd3_0%,#f8f3ee_100%)]"
                      : "bg-[linear-gradient(180deg,#ccb7a8_0%,#efe5de_100%)]"
                )}
              >
                {selected ? (
                  <div className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-white/85 text-[#8d6e58] shadow-sm">
                    <Check className="size-4.5" />
                  </div>
                ) : null}
              </div>

              <CardContent className="p-6">
                <Badge variant={selected ? "selected" : "default"}>
                  {item.category}
                </Badge>

                <h3 className="mt-4 text-2xl text-[#3d3128]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#7e6f63]">
                  {item.description}
                </p>

                <Button
                  type="button"
                  variant={selected ? "default" : "secondary"}
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => onSelectStyle(item.id)}
                >
                  {selected ? "Выбрано" : "Выбрать стиль"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
