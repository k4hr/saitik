import Link from "next/link";

import Container from "@/components/ui/container";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#eadfd6] bg-[#f6efe9]">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg tracking-[0.16em] text-[#3b2f26]">ATELIA</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#7e6f63]">
            AI-фотосессии в премиальном стиле. Авторизация по email, кредиты на
            балансе и личный кабинет со всеми заказами и результатами.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[#7e6f63]">
          <Link href="/styles" className="transition hover:text-[#3b2f26]">
            Стили
          </Link>
          <Link href="/create" className="transition hover:text-[#3b2f26]">
            Создать
          </Link>
          <Link href="/dashboard/billing" className="transition hover:text-[#3b2f26]">
            Кредиты
          </Link>
          <a href="#" className="transition hover:text-[#3b2f26]">
            Политика
          </a>
        </div>
      </Container>
    </footer>
  );
}
