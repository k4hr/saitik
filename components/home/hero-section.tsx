"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const tags = [
  "Pinterest aesthetic",
  "Luxury portrait",
  "Credits balance",
  "Email sign-in",
];

const floatingImages = [
  {
    src: "/demo/hero-float-1.png",
    alt: "ATELIA sample portrait",
    className: "left-0 top-8 sm:left-4 lg:-left-10 lg:top-16",
    rotation: "-rotate-3",
  },
  {
    src: "/demo/hero-float-2.png",
    alt: "ATELIA sample editorial portrait",
    className: "right-0 top-0 sm:right-6 lg:-right-8 lg:top-10",
    rotation: "rotate-2",
  },
  {
    src: "/demo/hero-float-3.png",
    alt: "ATELIA sample luxury portrait",
    className: "bottom-6 left-4 sm:left-12 lg:bottom-10 lg:left-2",
    rotation: "rotate-3",
  },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(248,242,237,1)_55%)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#efe2d7]/70 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-60px] h-[280px] w-[280px] rounded-full bg-[#f3e8de] blur-3xl" />
        <div className="absolute right-[-80px] top-[140px] h-[260px] w-[260px] rounded-full bg-[#ead8c9]/70 blur-3xl" />
      </div>

      <Container className="relative grid min-h-[calc(100vh-64px)] items-center gap-12 py-12 sm:min-h-[calc(100vh-80px)] sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd6] bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#9e7f68] backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            ATELIA premium photo studio
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.02] text-[#3d3128] sm:text-5xl lg:text-7xl">
            Премиальные AI-фотосессии с кабинетом, балансом и заказами
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Пользователь входит по email, пополняет кредиты, выбирает стиль или
            референс и получает серию кадров, которые выглядят как дорогая
            реальная съёмка.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/auth/sign-in">
                Начать через email
                <ArrowRight className="size-4.5" />
              </Link>
            </Button>

            <Button asChild variant="secondary" size="xl">
              <Link href="/styles">Посмотреть стили</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.06, duration: 0.35 }}
                className="rounded-full border border-[#e5d6ca] bg-white/75 px-4 py-2 text-xs text-[#7b6c61] backdrop-blur-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[#e7dbd1] pt-6">
            <div>
              <p className="text-2xl text-[#3d3128] sm:text-3xl">150</p>
              <p className="mt-2 text-sm text-[#7b6c61]">
                кредитов стартовый пакет
              </p>
            </div>
            <div>
              <p className="text-2xl text-[#3d3128] sm:text-3xl">20+</p>
              <p className="mt-2 text-sm text-[#7b6c61]">готовых стилей</p>
            </div>
            <div>
              <p className="text-2xl text-[#3d3128] sm:text-3xl">Email</p>
              <p className="mt-2 text-sm text-[#7b6c61]">вход и кабинет</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55 }}
          className="order-1 lg:order-2"
        >
          <div className="relative mx-auto max-w-[560px]">
            {floatingImages.map((item, index) => (
              <motion.div
                key={item.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.08, duration: 0.35 }}
                className={`absolute z-20 hidden h-[92px] w-[132px] overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(88,62,40,0.14)] backdrop-blur-xl md:block ${item.className} ${item.rotation}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="132px"
                  priority={index === 0}
                />
              </motion.div>
            ))}

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.42 }}
                className="space-y-4 sm:space-y-5"
              >
                <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[#e9ddd2] shadow-[0_18px_60px_rgba(88,62,40,0.10)]">
                  <div className="relative aspect-[0.78]">
                    <Image
                      src="/demo/hero-main-1.png"
                      alt="ATELIA premium portrait"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 280px"
                      priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(61,49,40,0.10)_100%)]" />
                  </div>
                </div>

                <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/75 shadow-[0_18px_60px_rgba(88,62,40,0.08)] backdrop-blur-sm">
                  <div className="relative aspect-[1.3]">
                    <Image
                      src="/demo/hero-main-2.png"
                      alt="ATELIA soft portrait sample"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 280px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.00)_0%,rgba(61,49,40,0.06)_100%)]" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.42 }}
                className="space-y-4 pt-8 sm:space-y-5 sm:pt-10"
              >
                <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(88,62,40,0.08)] backdrop-blur-sm">
                  <div className="relative aspect-[1.05]">
                    <Image
                      src="/demo/hero-main-3.png"
                      alt="ATELIA editorial portrait sample"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 280px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.00)_0%,rgba(61,49,40,0.06)_100%)]" />
                  </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[#eadfd6] shadow-[0_18px_60px_rgba(88,62,40,0.10)]">
                  <div className="relative aspect-[0.78]">
                    <Image
                      src="/demo/hero-main-4.png"
                      alt="ATELIA luxury portrait"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 280px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(61,49,40,0.10)_100%)]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
