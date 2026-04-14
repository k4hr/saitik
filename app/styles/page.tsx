import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import SectionShell from "@/components/layout/section-shell";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";

const categories = [
  "Все стили",
  "Pinterest",
  "Luxury",
  "Business",
  "Dating",
  "Travel",
  "Editorial",
];

const styles = [
  {
    title: "Old Money Portrait",
    category: "Luxury",
    text: "Тихая роскошь, дорогой спокойный образ, мягкий теплый свет.",
  },
  {
    title: "Pinterest Soft",
    category: "Pinterest",
    text: "Воздушная эстетика, нежные тона и ощущение идеальной съемки.",
  },
  {
    title: "Business Clean",
    category: "Business",
    text: "Деловые портреты для сайта, LinkedIn и личного бренда.",
  },
  {
    title: "Dating Premium",
    category: "Dating",
    text: "Живые привлекательные кадры для дейтинга и соцсетей.",
  },
  {
    title: "Travel Luxury",
    category: "Travel",
    text: "Серия с дорогим отпускным вайбом и premium-настроением.",
  },
  {
    title: "Editorial Vogue",
    category: "Editorial",
    text: "Журнальная композиция, fashion-подача и выразительный портрет.",
  },
  {
    title: "Studio Glow",
    category: "Pinterest",
    text: "Мягкий студийный свет и чистая дорогая картинка.",
  },
  {
    title: "Dark Masculine",
    category: "Luxury",
    text: "Более темный контрастный стиль с дорогим мужским образом.",
  },
  {
    title: "City Business Woman",
    category: "Business",
    text: "Сильная городская эстетика для экспертов и личного бренда.",
  },
];

export default async function StylesPage() {
  const session = await getSession();
  const primaryHref = session ? "/create" : "/auth/sign-in";

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      <section className="border-b border-[#eadfd6] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(248,242,237,1)_58%)]">
        <Container className="py-14 sm:py-18 lg:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Каталог фотосессий
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.04] text-[#3d3128] sm:text-5xl lg:text-6xl">
            Готовые стили, которые можно выбрать за пару секунд
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Не нужно думать над промптом. Просто выбирай эстетику, которая
            подходит под Instagram, дейтинг, бизнес или личный бренд.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href={primaryHref}>
                Запустить генерацию
                <ArrowRight className="size-4.5" />
              </Link>
            </Button>

            <Button variant="secondary" size="xl">
              <SlidersHorizontal className="size-4.5" />
              Фильтры скоро добавим
            </Button>
          </div>
        </Container>
      </section>

      <SectionShell
        eyebrow="Подборка"
        title="Стили под разные цели"
        description="Сейчас это визуальная витрина. Дальше сюда легко добавим фильтры, поиск, избранное и переход к заказу."
        centered={false}
      >
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm transition ${
                index === 0
                  ? "bg-[#b79273] text-white"
                  : "border border-[#d8c5b7] text-[#5f5248] hover:bg-[#efe4db]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {styles.map((item, index) => {
            const styleHref = session ? "/create" : "/auth/sign-in";

            return (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[30px] border border-[#eadfd6] bg-white shadow-[0_10px_35px_rgba(88,62,40,0.06)] transition hover:-translate-y-1"
              >
                <div
                  className={`aspect-[1/1.18] ${
                    index % 3 === 0
                      ? "bg-[linear-gradient(180deg,#dac7b8_0%,#f3ebe5_100%)]"
                      : index % 3 === 1
                        ? "bg-[linear-gradient(180deg,#e8ddd3_0%,#f8f3ee_100%)]"
                        : "bg-[linear-gradient(180deg,#ccb7a8_0%,#efe5de_100%)]"
                  }`}
                />

                <div className="p-6">
                  <div className="inline-flex rounded-full bg-[#f3e8df] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#9d7b62]">
                    {item.category}
                  </div>

                  <h2 className="mt-4 text-2xl text-[#3d3128]">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#7e6f63]">{item.text}</p>

                  <div className="mt-6 flex gap-3">
                    <Button asChild size="lg">
                      <Link href={styleHref}>Выбрать стиль</Link>
                    </Button>

                    <Button variant="secondary" size="lg">
                      Подробнее
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionShell>

      <SiteFooter />
    </main>
  );
}
