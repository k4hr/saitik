import SectionShell from "@/components/layout/section-shell";

const items = [
  { label: "Исходник" },
  { label: "Результат" },
  { label: "Исходник" },
  { label: "Результат" },
  { label: "Исходник" },
  { label: "Результат" },
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
              <div
                className={`aspect-[0.72] ${
                  index % 2 === 0
                    ? "bg-[linear-gradient(180deg,#ded1c7_0%,#f3ebe5_100%)]"
                    : "bg-[linear-gradient(180deg,#cdb5a5_0%,#efe5de_100%)]"
                }`}
              />
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
