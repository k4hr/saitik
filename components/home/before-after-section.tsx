import Image from "next/image";

import SectionShell from "@/components/layout/section-shell";

const items = [
  {
    type: "single" as const,
    label: "Исходник",
    image: "/demo/before-after/before-1.png",
  },
  {
    type: "single" as const,
    label: "Результат",
    image: "/demo/before-after/after-1.png",
  },
  {
    type: "double-diagonal" as const,
    label: "Исходник",
    imageTop: "/demo/before-after/before-2a.png",
    imageBottom: "/demo/before-after/before-2b.png",
  },
  {
    type: "single" as const,
    label: "Результат",
    image: "/demo/before-after/after-2.png",
  },
  {
    type: "single" as const,
    label: "Исходник",
    image: "/demo/before-after/before-3.png",
  },
  {
    type: "single" as const,
    label: "Результат",
    image: "/demo/before-after/after-3.png",
  },
];

export default function BeforeAfterSection() {
  return (
    <SectionShell
      id="before-after"
      eyebrow="Результаты"
      title="До / После"
      description="Вы можете посмотреть как работает наш сервис наглядно."
      className="bg-[#f7f1eb]"
    >
      <div className="mx-auto max-w-[820px]">
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="overflow-hidden rounded-[24px] border border-[#eadfd6] bg-white"
            >
              <div className="relative aspect-[0.72] overflow-hidden bg-[#f3ebe5]">
                {item.type === "single" ? (
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 320px"
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <div className="absolute left-[7%] top-[6%] h-[42%] w-[48%] overflow-hidden rounded-[18px] shadow-[0_10px_24px_rgba(61,49,40,0.10)]">
                      <Image
                        src={item.imageTop}
                        alt={`${item.label} 1`}
                        fill
                        className="object-cover"
                        sizes="220px"
                      />
                    </div>

                    <div className="absolute bottom-[6%] right-[7%] h-[42%] w-[48%] overflow-hidden rounded-[18px] shadow-[0_10px_24px_rgba(61,49,40,0.10)]">
                      <Image
                        src={item.imageBottom}
                        alt={`${item.label} 2`}
                        fill
                        className="object-cover"
                        sizes="220px"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#efe4db] px-4 py-3">
                <p className="text-sm text-[#7e6f63]">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
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
