"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const createOptions = [
  {
    title: "Создать фотосессию по готовым стилям",
    href: "/styles",
    icon: LayoutTemplate,
    eyebrow: "Готовые стили",
    badge: "Каталог готовых образов",
    images: [
      "/demo/create/styles-1.png",
      "/demo/create/styles-2.png",
      "/demo/create/styles-3.png",
      "/demo/create/styles-4.png",
      "/demo/create/styles-5.png",
    ],
    bgClass: "bg-[linear-gradient(180deg,#e6d7cb_0%,#f8f3ee_100%)]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_58%)]",
  },
  {
    title: "Создать по своему референсу",
    href: "/references",
    icon: ImagePlus,
    eyebrow: "Свой референс",
    badge: "Ваш референс + Ваше лицо",
    images: [
      "/demo/create/reference-1.jpg",
      "/demo/create/reference-2.jpg",
      "/demo/create/reference-3.jpg",
      "/demo/create/reference-4.jpg",
      "/demo/create/reference-5.jpg",
    ],
    bgClass: "bg-[linear-gradient(180deg,#eadfd7_0%,#fbf7f3_100%)]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.62),_transparent_60%)]",
  },
  {
    title: "Свободное редактирование",
    href: "/edit",
    icon: WandSparkles,
    eyebrow: "Свободный режим",
    badge: "Ваш промпт = любое изображение",
    images: [
      "/demo/create/edit-1.jpg",
      "/demo/create/edit-2.jpg",
      "/demo/create/edit-3.jpg",
      "/demo/create/edit-4.jpg",
      "/demo/create/edit-5.jpg",
    ],
    bgClass: "bg-[linear-gradient(180deg,#dccab9_0%,#f4ebe4_100%)]",
    glowClass:
      "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.48),_transparent_56%)]",
  },
];

function RotatingPreview({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative mx-auto h-[440px] w-[260px] sm:h-[500px] sm:w-[295px]">
      <div className="absolute inset-0 rounded-[34px] bg-white/35 blur-2xl" />

      <div className="relative h-full w-full overflow-hidden rounded-[34px] border border-white/70 bg-white/55 shadow-[0_22px_70px_rgba(88,62,40,0.14)] backdrop-blur-md">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            priority={index === 0}
            className={`object-cover transition-all duration-700 ${
              index === activeIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-[1.03]"
            }`}
            sizes="295px"
          />
        ))}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_0%,rgba(61,49,40,0.12)_100%)]" />

        <div className="absolute inset-x-5 top-5 flex items-center justify-center gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "w-8 bg-white/95"
                  : "w-1.5 bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

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
              Ниже сценарии по которым вы можете создать Ваше изображение.
            </p>
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
                  className={`relative overflow-hidden border-b border-[#efe4db] px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6 ${item.bgClass}`}
                >
                  <div className={`absolute inset-0 ${item.glowClass}`} />

                  <div className="relative mb-5 flex items-start justify-between gap-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#a18672] shadow-[0_8px_24px_rgba(88,62,40,0.08)] backdrop-blur-sm">
                      <Icon className="size-3.5" />
                      {item.eyebrow}
                    </div>

                    <div className="inline-flex size-12 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#9d7b62] shadow-[0_10px_28px_rgba(88,62,40,0.08)] backdrop-blur-sm">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <div className="relative">
                    <RotatingPreview images={item.images} alt={item.title} />
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-[30px] leading-tight text-[#3d3128]">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-5">
                    <span className="inline-flex rounded-full border border-[#e2d1c2] bg-[#fffaf6] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#9f7d65]">
                      {item.badge}
                    </span>
                  </div>

                  <Button asChild size="xl" className="w-full">
                    <Link href={item.href}>
                      Попробовать
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
