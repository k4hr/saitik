import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function AdminStylesPage() {
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
          <div className="mb-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
              Админ меню
            </p>
            <h1 className="mt-4 text-4xl leading-[1.06] sm:text-5xl">
              Готовые стили
            </h1>
            <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
              Здесь будут карточки витрины для готовых фотосессий. Сначала
              создаётся сам <strong>Style Preset</strong>, а потом к нему
              привязывается карточка витрины.
            </p>
          </div>

          <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
            <CardHeader>
              <CardTitle>Что уже нужно для этого раздела</CardTitle>
              <CardDescription>
                Сначала создаются готовые стили системы, потом карточки витрины.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 text-sm leading-7 text-[#6f6156]">
              <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4">
                • сначала создаёшь <strong>Style Preset</strong>
                <br />• потом загружаешь карточку витрины
                <br />• карточку привязываешь к нужному style preset
                <br />• после этого пользователь нажимает на карточку и попадает
                на уже выбранный стиль создания фотосессии
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/dashboard/admin/presets">Создать Style Preset</Link>
                </Button>

                <Button variant="secondary" size="lg">
                  Добавить карточку витрины
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      <SiteFooter />
    </main>
  );
}
