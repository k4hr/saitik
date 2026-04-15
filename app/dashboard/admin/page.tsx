import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ImagePlus,
  ImageIcon,
  LayoutGrid,
  FolderTree,
  Shield,
} from "lucide-react";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import Container from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";

const adminSections = [
  {
    title: "Готовые стили",
    description:
      "Карточки витрины для готовых сценариев, привязанных к StylePreset.",
    href: "/dashboard/admin/styles",
    icon: ImagePlus,
  },
  {
    title: "Пользовательские фотосессии",
    description:
      "Карточки витрины для пользовательских фотосессий по референсам.",
    href: "/dashboard/admin/custom-styles",
    icon: ImageIcon,
  },
  {
    title: "Категории витрины",
    description:
      "Создание верхних категорий для страницы стилей.",
    href: "/dashboard/admin/categories",
    icon: LayoutGrid,
  },
  {
    title: "Подкатегории витрины",
    description:
      "Создание подкатегорий внутри уже существующих категорий.",
    href: "/dashboard/admin/subcategories",
    icon: FolderTree,
  },
];

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f8f2ed] text-[#3d3128]">
      <SiteHeader />

      <section className="relative py-12 sm:py-14 lg:py-18">
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
                <h1 className="mt-1 text-4xl leading-[1.02] text-[#3d3128] sm:text-5xl">
                  Управление витриной сайта
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-4xl text-base leading-8 text-[#6f6156] sm:text-lg">
              Здесь ты управляешь категориями, подкатегориями и всеми
              карточками витрины сайта.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                type="button"
                size="xl"
                className="pointer-events-none rounded-[22px] bg-[#bc9670] text-[#2f241d] shadow-[0_12px_30px_rgba(95,69,48,0.14)]"
              >
                Загрузки и витрина
              </Button>

              <Button asChild variant="secondary" size="xl">
                <Link href="/dashboard">Назад в кабинет</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {adminSections.map((section) => {
                const Icon = section.icon;

                return (
                  <Card
                    key={section.title}
                    className="rounded-[28px] border border-[#eadfd6] bg-white/90 shadow-[0_16px_40px_rgba(95,69,48,0.08)]"
                  >
                    <CardContent className="p-6">
                      <div className="flex size-12 items-center justify-center rounded-full bg-[#f3e4d6] text-[#9f7f67]">
                        <Icon className="size-5" />
                      </div>

                      <h2 className="mt-5 text-2xl leading-tight text-[#3d3128]">
                        {section.title}
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-[#6f6156]">
                        {section.description}
                      </p>

                      <Button asChild size="lg" className="mt-6 w-full">
                        <Link href={section.href}>Открыть раздел</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
