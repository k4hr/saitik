"use client";

import {
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from "lucide-react";

type ImageOrientation = "portrait" | "landscape" | "square";

type ImageOrientationPickerProps = {
  value: ImageOrientation;
  onChange: (value: ImageOrientation) => void;
};

const options: Array<{
  value: ImageOrientation;
  icon: typeof RectangleVertical;
  label: string;
}> = [
  {
    value: "portrait",
    icon: RectangleVertical,
    label: "Вертикально",
  },
  {
    value: "landscape",
    icon: RectangleHorizontal,
    label: "Горизонтально",
  },
  {
    value: "square",
    icon: Square,
    label: "Квадрат",
  },
];

export default function ImageOrientationPicker({
  value,
  onChange,
}: ImageOrientationPickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
          Формат изображения
        </p>
        <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
          Выбери ориентацию финальной картинки.
        </p>
      </div>

      <div className="inline-flex rounded-[22px] border border-[#e1d3c6] bg-white p-1.5 shadow-[0_6px_20px_rgba(95,69,48,0.05)]">
        {options.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-label={option.label}
              title={option.label}
              className={`inline-flex h-12 w-14 items-center justify-center rounded-[18px] transition ${
                active
                  ? "bg-[#bc9670] text-[#2f241d]"
                  : "text-[#7b6b5f] hover:bg-[#f6eee8]"
              }`}
            >
              <Icon className="size-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
