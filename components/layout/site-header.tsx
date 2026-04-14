import Link from "next/link";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/layout/mobile-menu";
import { getSession } from "@/lib/auth";

const publicNavItems = [
  { label: "Стили", href: "/styles" },
  { label: "Создать", href: "/create" },
  { label: "Как это работает", href: "/#how-it-works" },
  { label: "Тарифы", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const privateNavItems = [
  { label: "Создать", href: "/create" },
  { label: "Стили", href: "/styles" },
  { label: "Заказы", href: "/dashboard/orders" },
  { label: "Кредиты", href: "/dashboard/billing" },
];

export default async function SiteHeader() {
  const session = await getSession();
  const isAuthenticated = Boolean(session);

  const navItems = isAuthenticated ? privateNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd6]/80 bg-[#f8f2ed]/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="shrink-0 text-lg tracking-[0.18em] text-[#3b2f26] sm:text-xl"
          >
            ATELIA
          </Link>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-[#6f6156] transition hover:text-[#3b2f26]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!isAuthenticated ? (
            <Button asChild>
              <Link href="/auth/sign-in">Войти / Регистрация</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">Личный кабинет</Link>
            </Button>
          )}
        </div>

        <MobileMenu items={navItems} isAuthenticated={isAuthenticated} />
      </Container>
    </header>
  );
}
