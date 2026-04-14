"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type CurrentUserResponse = {
  user?: {
    id: string;
    email: string;
    login: string;
    creditBalance: number;
    createdAt: string;
  } | null;
};

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setIsAuthenticated(false);
          }
          return;
        }

        const data = (await response.json()) as CurrentUserResponse;

        if (!cancelled) {
          setIsAuthenticated(Boolean(data.user));
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const primaryHref = isAuthenticated ? "/create" : "/auth/sign-in";

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
            Премиальные фотосессии с Вашим лицом
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Пользователь входит по email, пополняет кредиты, выбирает стиль или
            референс и получает серию кадров, которые выглядят как дорогая
            реальная съёмка.
          </p>

          <div className="mt-8 flex">
            <Button
              asChild
              size="xl"
              className="group relative min-w-[208px] overflow-hidden rounded-[24px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.42)_0%,rgba(255,248,242,0.24)_45%,rgba(234,216,201,0.30)_100%)] px-8 py-6 text-[15px] font-medium text-[#3d3128] shadow-[0_18px_48px_rgba(95,69,48,0.16),inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-1px_0_rgba(150,112,82,0.08)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/70 hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.52)_0%,rgba(255,248,242,0.30)_45%,rgba(234,216,201,0.38)_100%)] hover:shadow-[0_24px_60px_rgba(95,69,48,0.20),inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(150,112,82,0.10)] sm:min-w-[232px] sm:px-9"
            >
              <Link
                href={primaryHref}
                className="relative z-10 flex items-center justify-center gap-2.5"
              >
                <span className="relative">
                  Начать
                  <span className="absolute left-0 top-0 text-white/50 blur-[10px]">
                    Начать
                  </span>
                </span>

                <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />

                <span className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.65),transparent_34%),radial-gradient(circle_at_78%_26%,rgba(255,255,255,0.30),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_46%,rgba(255,255,255,0.06)_100%)] opacity-90" />
                <span className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-white/80" />
                <span className="pointer-events-none absolute -left-10 top-[-120%] h-[260%] w-20 rotate-[24deg] bg-white/30 blur-2xl transition-transform duration-700 group-hover:translate-x-[290px]" />
              </Link>
            </Button>
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
          <div className="mx-auto max-w-[560px]">
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
