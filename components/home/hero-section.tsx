"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Stars, Wand2 } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const tags = [
  "Pinterest aesthetic",
  "Luxury portrait",
  "Credits balance",
  "Email sign-in",
];

const floatingCards = [
  {
    title: "Email account",
    subtitle: "Заказы и история в кабинете",
    className: "left-0 top-8 sm:left-4 lg:-left-10 lg:top-16",
  },
  {
    title: "Reference match",
    subtitle: "По своей картинке",
    className: "right-0 top-0 sm:right-6 lg:-right-8 lg:top-10",
  },
  {
    title: "Credits wallet",
    subtitle: "Покупка генераций за кредиты",
    className: "bottom-6 left-4 sm:left-12 lg:bottom-10 lg:left-2",
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
              <p className="mt-2 text-sm text-[#7b6c61]">кредитов стартовый пакет</p>
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
            {floatingCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.08, duration: 0.35 }}
                className={`absolute z-20 hidden rounded-[22px] border border-[#eadfd6] bg-white/85 p-4 shadow-[0_20px_60px_rgba(88,62,40,0.12)] backdrop-blur-xl md:block ${card.className}`}
              >
                <p className="text-sm text-[#3d3128]">{card.title}</p>
                <p className="mt-1 text-xs text-[#8a7a6d]">{card.subtitle}</p>
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
                  <div className="relative aspect-[0.78] bg-[linear-gradient(180deg,#d8c5b7_0%,#f3ebe5_100%)]">
                    <div className="absolute inset-x-5 bottom-5 rounded-[22px] border border-white/70 bg-white/70 p-4 backdrop-blur-md">
                      <div className="flex items-center gap-2 text-sm text-[#8f735f]">
                        <Wand2 className="size-4" />
                        Выбран стиль
                      </div>
                      <p className="mt-2 text-lg text-[#3d3128]">Old Money Portrait</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#eadfd6] bg-white/65 p-5 backdrop-blur-sm">
                  <p className="text-sm text-[#a18672]">Почта и кабинет</p>
                  <p className="mt-2 text-lg leading-7 text-[#3d3128]">
                    Каждый заказ привязан к аккаунту пользователя и виден в истории.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.42 }}
                className="space-y-4 pt-8 sm:space-y-5 sm:pt-10"
              >
                <div className="rounded-[24px] border border-[#eadfd6] bg-white/70 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm text-[#a18672]">
                    <Stars className="size-4" />
                    Кредиты вместо тарифов
                  </div>
                  <p className="mt-2 text-lg leading-7 text-[#3d3128]">
                    Пополняй баланс и оплачивай генерации, референсы и улучшения по действиям.
                  </p>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[#eadfd6] shadow-[0_18px_60px_rgba(88,62,40,0.10)]">
                  <div className="relative aspect-[0.78] bg-[linear-gradient(180deg,#cdb7a7_0%,#f7f0ea_100%)]">
                    <div className="absolute inset-x-5 top-5 rounded-[22px] border border-white/70 bg-white/75 p-4 backdrop-blur-md">
                      <p className="text-sm text-[#8f735f]">Баланс</p>
                      <p className="mt-2 text-lg text-[#3d3128]">400 credits available</p>
                    </div>
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
