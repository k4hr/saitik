"use client";

import { useState } from "react";

import SectionShell from "@/components/layout/section-shell";

type BeforeAfterColumn = {
  label: "Исходник" | "Результат";
  images: string[];
};

type BeforeAfterRow = {
  id: string;
  before: BeforeAfterColumn;
  after: BeforeAfterColumn;
};

const rows: BeforeAfterRow[] = [
  {
    id: "row-1",
    before: {
      label: "Исходник",
      images: ["/demo/before-after/before-1.png"],
    },
    after: {
      label: "Результат",
      images: [
        "/demo/before-after/after-1.png",
        "/demo/before-after/after-1-2.png",
        "/demo/before-after/after-1-3.png",
      ],
    },
  },
  {
    id: "row-2",
    before: {
      label: "Исходник",
      images: [
        "/demo/before-after/before-2a.png",
        "/demo/before-after/before-2b.png",
      ],
    },
    after: {
      label: "Результат",
      images: [
        "/demo/before-after/after-2.png",
        "/demo/before-after/after-2-2.png",
        "/demo/before-after/after-2-3.png",
      ],
    },
  },
  {
    id: "row-3",
    before: {
      label: "Исходник",
      images: ["/demo/before-after/before-3.PNG"],
    },
    after: {
      label: "Результат",
      images: [
        "/demo/before-after/after-3.PNG",
        "/demo/before-after/after-3-2.png",
        "/demo/before-after/after-3-3.png",
      ],
    },
  },
];

type SwitchableCardProps = {
  label: string;
  images: string[];
};

function SwitchableCard({ label, images }: SwitchableCardProps) {
  const safeImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasMany = safeImages.length > 1;
  const currentImage = safeImages[activeIndex] || "";

  function handleNext() {
    if (!hasMany) return;
    setActiveIndex((prev) => (prev + 1) % safeImages.length);
  }

  return (
    <button
      type="button"
      onClick={handleNext}
      className="group block w-full text-left"
      aria-label={hasMany ? `${label}: переключить карточку` : label}
    >
      <div className="overflow-hidden rounded-[24px] border border-[#eadfd6] bg-white shadow-[0_10px_24px_rgba(61,49,40,0.06)]">
        <div className="relative aspect-[0.72] overflow-hidden bg-[#f3ebe5]">
          {hasMany ? (
            <>
              {safeImages.slice(1).map((image, index) => {
                const reverseIndex = safeImages.slice(1).length - index;
                const offset = reverseIndex * 14;

                return (
                  <div
                    key={`${image}-${index}`}
                    className="pointer-events-none absolute inset-y-[10px] right-[-4px] w-[78%] overflow-hidden rounded-[24px] border border-white/50 bg-[#eadfd6] shadow-[0_14px_28px_rgba(61,49,40,0.10)]"
                    style={{
                      transform: `translateX(${offset}px) scale(${1 - reverseIndex * 0.04})`,
                      zIndex: index + 1,
                    }}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                );
              })}
            </>
          ) : null}

          <div className="absolute inset-0 z-10 overflow-hidden rounded-[24px] bg-[#f3ebe5]">
            {currentImage ? (
              <img
                src={currentImage}
                alt={label}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                draggable={false}
              />
            ) : null}
          </div>

          {hasMany ? (
            <div className="pointer-events-none absolute left-1/2 top-3 z-20 flex -translate-x-1/2 gap-1.5">
              {safeImages.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-7 bg-white"
                      : "w-1.5 bg-white/55"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="border-t border-[#efe4db] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#7e6f63]">{label}</p>
            {hasMany ? (
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#b08d73]">
                Нажми
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function BeforeAfterSection() {
  return (
    <SectionShell
      id="before-after"
      eyebrow="Результаты"
      title="До / После"
      description="Вы можете посмотреть как работает наш сервис наглядно."
      className="bg-[#f7f1eb]"
    >
      <div className="mx-auto max-w-[820px] space-y-4 sm:space-y-5">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-2 gap-4 sm:gap-5">
            <SwitchableCard
              label={row.before.label}
              images={row.before.images}
            />
            <SwitchableCard
              label={row.after.label}
              images={row.after.images}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="#pricing"
          className="inline-flex rounded-full bg-[#b79273] px-7 py-3.5 text-sm text-white transition hover:bg-[#a88466]"
        >
          Попробовать
        </a>
      </div>
    </SectionShell>
  );
}
