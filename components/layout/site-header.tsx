import Link from 'next/link';
import Container from '@/components/ui/container';

const navItems = [
  { label: 'Стили', href: '#styles' },
  { label: 'Как это работает', href: '#how-it-works' },
  { label: 'До / После', href: '#before-after' },
  { label: 'Тарифы', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd6]/80 bg-[#f8f2ed]/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link
          href="/"
          className="shrink-0 text-lg tracking-[0.18em] text-[#3b2f26] sm:text-xl"
        >
          OKAK
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-[#6f6156] transition hover:text-[#3b2f26]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="hidden rounded-full border border-[#d8c5b7] px-5 py-2 text-sm text-[#6f6156] transition hover:bg-[#efe4db] sm:inline-flex"
          >
            Тарифы
          </a>

          <a
            href="#hero"
            className="inline-flex rounded-full bg-[#b79273] px-5 py-2 text-sm text-white transition hover:bg-[#a88466]"
          >
            Попробовать
          </a>
        </div>
      </Container>
    </header>
  );
}
