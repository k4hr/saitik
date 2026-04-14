import Link from "next/link";
import {
  ArrowRight,
  ImagePlus,
  LayoutTemplate,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import Container from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const createOptions = [
  {
    title: "Создать фотосессию по готовым стилям",
    description:
      "Выбери готовую эстетику из каталога ATELIA и перейди к подбору подходящего стиля.",
    href: "/styles",
    icon: LayoutTemplate,
    eyebrow: "Готовые стили",
    accent: "Каталог · Luxury · Pinterest · Business",
    points: [
      "быстрый старт без промпта",
      "готовые премиальные сценарии",
      "удобно для первого заказа",
    ],
    bgClass:
      "bg-[linear-gradient(180deg,#e6d7cb_0%,#f8f3ee_100%)]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_58%)]",
  },
  {
    title: "Создать по своему референсу",
    description:
      "Загрузи лицо пользователя и свой референс, чтобы собрать фотосессию под конкретную картинку или Pinterest-вайб.",
    href: "/references",
    icon: ImagePlus,
    eyebrow: "Свой референс",
    accent: "Лицо + референс + настройки",
    points: [
      "максимально близко к нужной картинке",
      "подходит под Pinterest и moodboard",
      "идеально для точного вайба",
    ],
    bgClass:
      "bg-[linear-gradient(180deg,#eadfd7_0%,#fbf7f3_100%)]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.62),_transparent_60%)]",
  },
  {
    title: "Свободное редактирование",
    description:
      "Загрузи изображение, введи свободный промпт и дальше делай с картинкой то, что нужно под твой сценарий.",
    href: "/edit",
    icon: WandSparkles,
    eyebrow: "Свободный режим",
    accent: "Prompt · Edit · Transform",
    points: [
      "полный контроль над результатом",
      "подходит для нестандартных задач",
      "можно делать сложные трансформации",
    ],
    bgClass:
      "bg-[linear-gradient(180deg,#dccab9_0%,#f4ebe4_100%)]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.48),_transparent_56%)]",
  },
];

export default function CreateEntryShell() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 lg:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#efe2d7]/70 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-40px] h-[240px] w-[240px] rounded-full bg-[#f3e8de] blur-3xl" />
        <div className="absolute right-[-80px] top-[220px] h-[220px] w-[220px] rounded-full bg-[#ead8c9]/65 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="mb-10 rounded-[36px] border border-[#eadfd6] bg-[linear-gradient(180deg,#fffaf6_0%,#f5ece5_100%)] p-6 shadow-[0_18px_60px_rgba(88,62,40,0.08)] sm:p-8 lg:p-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd6] bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#9e7f68] backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              Create
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl leading-[1.02] text-[#3d3128] sm:text-5xl lg:text-6xl">
              Выбери, как именно ты хочешь создать результат
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
              Это основной экран входа в сценарии ATELIA. Пользователь может
              выбрать быстрый путь через готовые стили, более точный путь через
              свой референс или полностью свободный режим редактирования.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#e5d6ca] bg-white/75 px-4 py-2 text-xs text-[#7b6c61] backdrop-blur-sm">
                Premium flow
              </span>
              <span className="rounded-full border border-[#e5d6ca] bg-white/75 px-4 py-2 text-xs text-[#7b6c61] backdrop-blur-sm">
                Upload face
              </span>
              <span className="rounded-full border border-[#e5d6ca] bg-white/75 px-4 py-2 text-xs text-[#7b6c61] backdrop-blur-sm">
                Reference mode
              </span>
              <span className="rounded-full border border-[#e5d6ca] bg-white/75 px-4 py-2 text-xs text-[#7b6c61] backdrop-blur-sm">
                Free editing
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {createOptions.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="group overflow-hidden rounded-[34px] border-[#eadfd6] bg-white/95 shadow-[0_12px_40px_rgba(88,62,40,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_80px_rgba(88,62,40,0.12)]"
              >
                <div
                  className={`relative min-h-[360px] overflow-hidden border-b border-[#efe4db] ${item.bgClass}`}
                >
                  <div className={`absolute inset-0 ${item.glowClass}`} />

                  <div className="absolute inset-x-6 top-6 flex items-start justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#a18672] shadow-[0_8px_24px_rgba(88,62,40,0.08)] backdrop-blur-sm">
                      <Icon className="size-3.5" />
                      {item.eyebrow}
                    </div>

                    <div className="inline-flex size-12 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#9d7b62] shadow-[0_10px_28px_rgba(88,62,40,0.08)] backdrop-blur-sm">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <div className="absolute inset-x-6 top-[92px] rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_14px_40px_rgba(88,62,40,0.08)] backdrop-blur-md">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#a18672]">
                      {item.accent}
                    </p>

                    <h2 className="mt-3 text-[30px] leading-tight text-[#3d3128]">
                      {item.title}
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-[#726458]">
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute inset-x-6 bottom-6 rounded-[24px] border border-white/70 bg-white/78 p-5 shadow-[0_10px_30px_rgba(88,62,40,0.08)] backdrop-blur-md">
                    <div className="grid gap-2">
                      {item.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-2 text-sm text-[#5f5248]"
                        >
                          <span className="mt-[8px] inline-block h-1.5 w-1.5 rounded-full bg-[#b79273]" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-[28px] leading-tight text-[#3d3128]">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-7 text-[#7e6f63]">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-5 rounded-[22px] border border-[#eadfd6] bg-[#fffaf6] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#a18672]">
                      Что дальше
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#6e6055]">
                      После выбора сценария пользователь попадает в отдельный
                      flow с нужными шагами именно под этот тип создания.
                    </p>
                  </div>

                  <Button asChild size="xl" className="w-full">
                    <Link href={item.href}>
                      Открыть сценарий
                      <ArrowRight className="size-4.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
