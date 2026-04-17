import Link from "next/link";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type SharePageProps = {
  params: Promise<{
    shareId: string;
  }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { shareId } = await params;

  const order = await prisma.order.findUnique({
    where: { shareId },
    select: {
      shareId: true,
      status: true,
      title: true,
      createdAt: true,
      assets: {
        where: {
          type: "RESULT",
        },
        take: 1,
        select: {
          id: true,
        },
      },
    },
  });

  if (!order || order.status !== "DONE" || order.assets.length === 0) {
    notFound();
  }

  const imagePath = `/api/results/${order.shareId}`;
  const downloadPath = `/api/results/${order.shareId}?download=1`;

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      <section className="py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                Поделиться результатом
              </p>
              <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl">
                {order.title?.trim() || "Результат генерации"}
              </h1>
              <p className="mt-4 text-base leading-8 text-[#726458] sm:text-lg">
                Готовая картинка из ATELIA.
              </p>
            </div>

            <Card className="overflow-hidden rounded-[34px] border-[#eadfd6] bg-white/95 shadow-[0_12px_40px_rgba(88,62,40,0.06)]">
              <CardContent className="p-4 sm:p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePath}
                  alt={order.title?.trim() || "Результат генерации"}
                  className="w-full rounded-[28px] object-cover"
                />
              </CardContent>
            </Card>

            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="xl">
                <a href={downloadPath}>Скачать</a>
              </Button>

              <Button asChild variant="secondary" size="xl">
                <Link href="/">Открыть сайт</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
