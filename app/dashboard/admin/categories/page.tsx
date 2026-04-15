import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderPlus, Shield, Sparkles } from "lucide-react";

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

export default async function AdminCategoriesPage() {
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

      <section className="py-12 sm:py-14 lg:py-18">
        <Container>
          <div className="mx-auto max-w-5xl rounded-[32px] border border-white/60 bg-white/45 p-6 shadow-[0_24px_80px_rgba(91,67,49,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#bc9670] text-white shadow-[0_10px_24px_rgba(95,69,48,0.18)]">
                <Shield className="size-5" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                  Админ меню
                </p>
                <h1 className="mt-1 text-4xl leading-[1.06] sm:text-5xl">
                  Категории витрины
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#726458] sm:text-lg">
              Здесь ты сможешь создавать новые категории, например “Другое”, и
              заводить под них отдельные подкатегории без правок кода.
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

            <Card className="mt-8 rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
              <CardHeader>
                <CardTitle>Управление категориями</CardTitle>
                <CardDescription>
                  Подготовим форму для категорий и подкатегорий.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 text-sm leading-7 text-[#6f6156]">
                <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4">
                  • создание новой категории
                  <br />• создание подкатегории внутри категории
                  <br />• сортировка порядка на витрине
                  <br />• включение и выключение отображения
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg">
                    <FolderPlus className="size-4.5" />
                    Добавить категорию
                  </Button>

                  <Button asChild variant="secondary" size="lg">
                    <Link href="/dashboard/admin/styles">
                      <Sparkles className="size-4.5" />
                      К готовым стилям
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
