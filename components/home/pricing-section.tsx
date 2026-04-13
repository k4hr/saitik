import Link from "next/link";

import SectionShell from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";

const creditPacks = [
  {
    name: "Starter",
    credits: "150 кредитов",
    price: "990 ₽",
    desc: "Для первого входа в сервис и нескольких базовых генераций.",
    features: ["Готовые стили", "История заказов", "Хранение в кабинете"],
    featured: false,
  },
  {
    name: "Growth",
    credits: "400 кредитов",
    price: "2 490 ₽",
    desc: "Оптимальный баланс для регулярных генераций и референсов.",
    features: ["Лучший курс", "Референсы и reroll", "Подходит для частых заказов"],
    featured: true,
  },
  {
    name: "Studio",
    credits: "900 кредитов",
    price: "4 990 ₽",
    desc: "Для активного использования и дорогих сценариев с апгрейдами.",
    features: ["Максимально выгодно", "4K и upscale", "Серии заказов"],
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <SectionShell
      id="pricing"
      eyebrow="Кредиты"
      title="Баланс, который тратится на генерации"
      description="Пользователь покупает кредиты на баланс, а потом тратит их на стили, референсы, reroll, upscale и другие действия внутри кабинета."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {creditPacks.map((pack) => (
          <div
            key={pack.name}
            className={`rounded-[30px] border p-7 shadow-[0_10px_35px_rgba(88,62,40,0.06)] ${
              pack.featured
                ? "border-[#caa789] bg-[#fffaf6]"
                : "border-[#eadfd6] bg-white"
            }`}
          >
            {pack.featured ? (
              <span className="inline-flex rounded-full bg-[#f1e0d1] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#9a7658]">
                Popular
              </span>
            ) : null}

            <h3 className="mt-4 text-3xl text-[#3d3128]">{pack.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[#7e6f63]">{pack.desc}</p>
            <p className="mt-6 text-lg text-[#8a715d]">{pack.credits}</p>
            <p className="mt-2 text-4xl text-[#3d3128]">{pack.price}</p>

            <ul className="mt-6 space-y-3 text-sm text-[#6d5f54]">
              {pack.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>

            <Button asChild size="lg" className="mt-8 w-full">
              <Link href="/dashboard/billing">Пополнить баланс</Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[28px] border border-[#eadfd6] bg-white p-6 text-sm leading-7 text-[#7e6f63] shadow-[0_10px_35px_rgba(88,62,40,0.05)]">
        Пример списаний: готовый стиль — <span className="text-[#3d3128]">40 кредитов</span>,
        генерация по своему референсу — <span className="text-[#3d3128]">70 кредитов</span>,
        reroll — <span className="text-[#3d3128]">20 кредитов</span>, 4K export — <span className="text-[#3d3128]">30 кредитов</span>.
      </div>
    </SectionShell>
  );
}
