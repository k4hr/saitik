import Link from "next/link";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-[#f6efe9] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="rounded-[36px] border border-[#e5d7cb] bg-[linear-gradient(180deg,#fffaf6_0%,#f4ebe4_100%)] px-6 py-10 text-center shadow-[0_18px_60px_rgba(88,62,40,0.08)] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <p className="text-xs uppercase tracking-[0.24em] text-[#a18672]">
            Готов к запуску
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl leading-tight text-[#3d3128] sm:text-4xl lg:text-5xl">
            Войди по почте и собери первую AI-фотосессию в ATELIA
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#7e6f63] sm:text-base">
            Авторизация, баланс кредитов, каталог стилей и личный кабинет уже
            заложены в архитектуру проекта и готовы к следующему этапу.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/sign-in">Войти по почте</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/dashboard/billing">Посмотреть кредиты</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
