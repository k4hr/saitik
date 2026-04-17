"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";

import Container from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type GenerationItem = {
  id: string;
  title: string;
  status: string;
  credits: number;
  createdAtLabel: string;
  imagePath?: string | null;
  downloadPath?: string | null;
  sharePath?: string | null;
};

type DashboardOrdersProps = {
  generations: GenerationItem[];
};

function ShareButton({ sharePath }: { sharePath: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = `${window.location.origin}${sharePath}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Результат ATELIA",
          url: shareUrl,
        });
        return;
      } catch {
        // noop
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="secondary" size="lg" onClick={handleShare}>
      <Share2 className="size-4.5" />
      {copied ? "Ссылка скопирована" : "Поделиться"}
    </Button>
  );
}

export default function DashboardOrders({
  generations,
}: DashboardOrdersProps) {
  return (
    <section className="py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl">
            Мои генерации
          </h1>
          <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
            Здесь пользователь видит свои заказы, готовые картинки, кнопки скачать
            и поделиться ссылкой на сайт.
          </p>
        </div>

        <div className="space-y-4">
          {generations.length === 0 ? (
            <Card className="rounded-[28px] border border-[#eadfd6] bg-white/90 shadow-[0_16px_40px_rgba(95,69,48,0.06)]">
              <CardContent className="p-6 text-sm leading-7 text-[#7e6f63]">
                У пользователя пока нет генераций.
              </CardContent>
            </Card>
          ) : (
            generations.map((generation) => (
              <Card
                key={generation.id}
                className="rounded-[28px] border border-[#eadfd6] bg-white/90 shadow-[0_16px_40px_rgba(95,69,48,0.06)]"
              >
                <CardContent className="grid gap-6 p-6 lg:grid-cols-[260px_1fr]">
                  <div className="overflow-hidden rounded-[24px] border border-[#eadfd6] bg-[#f7efe8]">
                    {generation.imagePath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={generation.imagePath}
                        alt={generation.title}
                        className="aspect-[0.8] w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[0.8] w-full bg-[linear-gradient(180deg,#ddd0c6_0%,#f4ece6_100%)]" />
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-5">
                    <div>
                      <p className="text-sm text-[#a18672]">{generation.id}</p>
                      <h2 className="mt-2 text-2xl text-[#3d3128]">
                        {generation.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                        Создано: {generation.createdAtLabel}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="ivory">{generation.status}</Badge>
                      <Badge variant="default">
                        {generation.credits} credits
                      </Badge>
                    </div>

                    {generation.imagePath && generation.downloadPath && generation.sharePath ? (
                      <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg">
                          <a href={generation.downloadPath}>
                            <Download className="size-4.5" />
                            Скачать
                          </a>
                        </Button>

                        <ShareButton sharePath={generation.sharePath} />
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
