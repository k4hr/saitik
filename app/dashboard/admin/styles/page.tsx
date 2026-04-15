import { redirect } from "next/navigation";

import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import Container from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";

function getIsAdmin(email: string | undefined): boolean {
  if (!email) {
    return false;
  }

  const raw = process.env.ADMIN_EMAILS ?? "";
  const adminEmails = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase());
}

export default async function AdminStylesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (!getIsAdmin(session.email)) {
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
              Управление стилями
            </h1>
            <p className="mt-5 text-base leading-8 text-[#726458] sm:text-lg">
              Здесь будет удобно добавлять готовые стили, загружать обложки и
              сразу выбирать, в какую категорию и подкатегорию уходит стиль.
            </p>
          </div>

          <Card className="rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_20px_60px_rgba(95,69,48,0.08)]">
            <CardHeader>
              <CardTitle>Что здесь добавим следующим шагом</CardTitle>
              <CardDescription>
                Это заготовка под нормальную админку каталога.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 text-sm leading-7 text-[#6f6156]">
              <div className="rounded-[20px] border border-[#eadfd6] bg-[#fffaf6] p-4">
                • тип каталога: <strong>Готовые</strong> / <strong>Пользовательские</strong>
                <br />
                • верхняя категория: <strong>Женские</strong> / <strong>Мужские</strong> / <strong>Семейные</strong>
                <br />
                • подкатегория: <strong>Old Money</strong>, <strong>Business</strong>, <strong>Pinterest</strong> и т.д.
                <br />
                • загрузка обложки
                <br />
                • привязка к реальному style preset id
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg">Добавить стиль</Button>
                <Button variant="secondary" size="lg">
                  Добавить категорию
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
