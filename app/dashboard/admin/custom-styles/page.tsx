import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutGrid, Shield } from "lucide-react";
import { ShowcaseKind } from "@prisma/client";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import Container from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ShowcaseItemCreateForm from "@/components/admin/showcase-item-create-form";
import EntityVisibilityToggle from "@/components/admin/entity-visibility-toggle";

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default async function AdminCustomStylesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [categories, subcategories, items] = await Promise.all([
    prisma.showcaseCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.showcaseSubcategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
      },
    }),
    prisma.showcaseItem.findMany({
      where: { kind: ShowcaseKind.CUSTOM },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        coverImageUrl: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const suggestedSortOrder =
    items.length > 0 ? Math.max(...items.map((item) => item.sortOrder)) + 10 : 10;

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      <section className="py-12 sm:py-14 lg:py-18">
        <Container>
          <div className="mx-auto max-w-6xl rounded-[32px] border border-white/60 bg-white/45 p-6 shadow-[0_24px_80px_rgba(91,67,49,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#bc9670] text-white shadow-[0_10px_24px_rgba(95,69,48,0.18)]">
                <Shield className="size-5" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                  Админ меню
                </p>
                <h1 className="mt-1 text-4xl leading-[1.06] sm:text-5xl">
                  Пользовательские фотосессии
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#726458] sm:text-lg">
              Здесь добавляются пользовательские карточки для режима по
              референсам.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                type="button"
                size="xl"
                className="pointer-events-none rounded-[22px] bg-[#bc9670] text-[#2f241d]"
              >
                Загрузки и витрина
              </Button>

              <Button asChild variant="secondary" size="xl">
                <Link href="/dashboard/admin">Назад в админ меню</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[430px_1fr]">
              <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
                <CardHeader>
                  <CardTitle>Добавить пользовательскую карточку</CardTitle>
                  <CardDescription>
                    Создай карточку пользовательской фотосессии и отправь её в
                    нужную категорию.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {categories.length === 0 ? (
                    <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4 text-sm leading-7 text-[#6f6156]">
                      Сначала создай хотя бы одну категорию.
                      <div className="mt-4">
                        <Button asChild size="lg">
                          <Link href="/dashboard/admin/categories">
                            <LayoutGrid className="size-4.5" />
                            Перейти к категориям
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <ShowcaseItemCreateForm
                      kind={ShowcaseKind.CUSTOM}
                      categories={categories}
                      subcategories={subcategories}
                      suggestedSortOrder={suggestedSortOrder}
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
                <CardHeader>
                  <CardTitle>Текущие пользовательские карточки</CardTitle>
                  <CardDescription>
                    Карточки, которые уже созданы во вкладке пользовательских
                    фотосессий.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {items.length === 0 ? (
                    <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4 text-sm leading-7 text-[#6f6156]">
                      Пока нет ни одной пользовательской карточки.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-[22px] border border-[#eadfd6] bg-[#fffaf6] p-5 shadow-[0_8px_24px_rgba(95,69,48,0.04)]"
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-xl text-[#3d3128]">
                                    {item.title}
                                  </h3>

                                  <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em] ${
                                      item.isActive
                                        ? "bg-[#eef3ea] text-[#667257]"
                                        : "bg-[#f5ede8] text-[#9b8575]"
                                    }`}
                                  >
                                    {item.isActive ? "Активна" : "Скрыта"}
                                  </span>
                                </div>

                                <p className="mt-2 text-sm text-[#7e6f63]">
                                  slug:{" "}
                                  <span className="font-medium text-[#3d3128]">
                                    {item.slug}
                                  </span>
                                </p>

                                <p className="mt-1 text-sm text-[#7e6f63]">
                                  Категория:{" "}
                                  <span className="font-medium text-[#3d3128]">
                                    {item.category.name}
                                  </span>
                                  {item.subcategory ? ` / ${item.subcategory.name}` : ""}
                                </p>

                                <p className="mt-1 text-sm text-[#7e6f63]">
                                  Создан: {formatDate(item.createdAt)}
                                </p>
                              </div>

                              <div className="grid shrink-0 grid-cols-2 gap-3 text-center">
                                <div className="rounded-[18px] border border-[#eadfd6] bg-white px-4 py-3">
                                  <p className="text-xs uppercase tracking-[0.14em] text-[#a18672]">
                                    Порядок
                                  </p>
                                  <p className="mt-2 text-lg text-[#3d3128]">
                                    {item.sortOrder}
                                  </p>
                                </div>

                                <div className="rounded-[18px] border border-[#eadfd6] bg-white px-4 py-3">
                                  <p className="text-xs uppercase tracking-[0.14em] text-[#a18672]">
                                    Обложка
                                  </p>
                                  <a
                                    href={item.coverImageUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-block text-sm text-[#8b6b53] underline decoration-[#ccb29d] underline-offset-4"
                                  >
                                    Открыть
                                  </a>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end">
                              <EntityVisibilityToggle
                                id={item.id}
                                endpoint="/api/admin/showcase-items"
                                initialIsActive={item.isActive}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
