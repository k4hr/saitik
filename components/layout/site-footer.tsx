import Link from "next/link";

import Container from "@/components/ui/container";
import { getSession } from "@/lib/auth";

export default async function SiteFooter() {
  const session = await getSession();
  const createHref = session ? "/create" : "/auth/sign-in";
  const billingHref = session ? "/dashboard/billing" : "/auth/sign-in";

  return (
    <footer className="bg-[#201712] text-white">
      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-xl">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-2xl text-white transition hover:text-[#ead6c7]"
            >
              <span className="text-[#c79f7a]">✦</span>
              <span className="tracking-[-0.02em]">ATELIA</span>
            </Link>

            <p className="mt-5 max-w-md text-base leading-8 text-white/72">
              AI-фотосессии в премиальном стиле — быстро, аккуратно и с
              сохранением общего визуального качества.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/62">
                Продукт
              </p>
              <div className="mt-4 flex flex-col gap-3 text-base text-white">
                <Link href="/" className="transition hover:text-[#ead6c7]">
                  Главная
                </Link>
                <Link href="/styles" className="transition hover:text-[#ead6c7]">
                  Стили
                </Link>
                <Link href={createHref} className="transition hover:text-[#ead6c7]">
                  Создать
                </Link>
                <Link
                  href={billingHref}
                  className="transition hover:text-[#ead6c7]"
                >
                  Кредиты
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/62">
                Поддержка
              </p>
              <div className="mt-4 flex flex-col gap-3 text-base text-white">
                <a
                  href="mailto:support@atelia.site"
                  className="transition hover:text-[#ead6c7]"
                >
                  support@atelia.site
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/62">
                Документы
              </p>
              <div className="mt-4 flex flex-col gap-3 text-base text-white">
                <Link
                  href="/privacy-policy"
                  className="transition hover:text-[#ead6c7]"
                >
                  Конфиденциальность
                </Link>
                <Link href="/terms" className="transition hover:text-[#ead6c7]">
                  Условия
                </Link>
                <Link href="/offer" className="transition hover:text-[#ead6c7]">
                  Оферта
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="text-sm text-white/74">
            © 2026 ATELIA. Все права защищены.
          </p>
        </div>
      </Container>
    </footer>
  );
}
