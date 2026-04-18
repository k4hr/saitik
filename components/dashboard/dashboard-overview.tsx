"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Share2, Sparkles } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type GenerationCard = {
  id: string;
  title: string;
  status: string;
  credits: number;
  createdAtLabel: string;
  imagePath: string | null;
  downloadPath: string | null;
  sharePath: string | null;
};

type DashboardOrdersProps = {
  generations: GenerationCard[];
};

export default function DashboardOrders({
  generations,
}: DashboardOrdersProps) {
  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mx-auto max-w-6xl rounded-[34px] border border-white/60 bg-white/45 p-6 shadow-[0_24px_80px_rgba(91,67,49,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Личный кабинет
          </p>

          <h1 className="mt-4 text-4xl leading-[1.04] text-[#3d3128] sm:text-5xl">
            Мои заказы
          </h1>

          <div className="mt-8 space-y-5">
            {generations.length === 0 ? (
              <div className="rounded-[28px] border border-[#eadfd6] bg-white/80 p-8 text-center shadow-[0_12px_34px_rgba(95,69,48,0.06)]">
                <p className="text-base text-[#726458]">
                  У тебя пока нет заказов.
                </p>
              </div>
            ) : (
              generations.map((item) => {
                const isProcessing = item.status === "В обработке";

                return (
                  <div
                    key={item.id}
                    className="grid gap-0 overflow-hidden rounded-[28px] border border-[#eadfd6] bg-white/90 shadow-[0_14px_36px_rgba(95,69,48,0.06)] md:grid-cols-[240px_1fr]"
                  >
                    <div className="relative min-h-[240px] bg-[#efe3d7]">
                      {item.imagePath ? (
                        <Image
                          src={item.imagePath}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="240px"
                        />
                      ) : (
                        <div className="flex h-full min-h-[240px] items-center justify-center text-[#a18672]">
                          <Sparkles className="size-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-between p-6 sm:p-8">
                      <div>
                        <h2 className="text-3xl leading-tight text-[#3d3128]">
                          {item.title}
                        </h2>

                        <p className="mt-3 text-sm text-[#7e6f63]">
                          Создано: {item.createdAtLabel}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full border border-[#d8c5b7] bg-[#fffaf6] px-4 py-2 text-sm text-[#5f5248]">
                            {item.status}
                          </span>

                          <span className="inline-flex rounded-full border border-[#d8c5b7] bg-[#fffaf6] px-4 py-2 text-sm text-[#5f5248]">
                            {item.credits} credits
                          </span>
                        </div>

                        {isProcessing ? (
                          <div className="mt-6 rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] px-5 py-4">
                            <p className="text-base text-[#3d3128]">
                              Подождите, идет генерация.
                            </p>
                          </div>
                        ) : null}
                      </div>

                      {!isProcessing && item.downloadPath && item.sharePath ? (
                        <div className="mt-8 flex flex-wrap gap-3">
                          <Button asChild size="lg">
                            <Link href={item.downloadPath}>
                              <Download className="size-4.5" />
                              Скачать
                            </Link>
                          </Button>

                          <Button asChild size="lg" variant="secondary">
                            <Link href={item.sharePath}>
                              <Share2 className="size-4.5" />
                              Поделиться
                            </Link>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
