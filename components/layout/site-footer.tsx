import Container from '@/components/ui/container';

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#eadfd6] bg-[#f6efe9]">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg tracking-[0.16em] text-[#3b2f26]">OKAK</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#7e6f63]">
            AI-фотосессии в премиальном стиле. Загрузи свои фото, выбери образ
            и получи готовые кадры для соцсетей, дейтинга и личного бренда.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[#7e6f63]">
          <a href="#" className="transition hover:text-[#3b2f26]">
            Политика
          </a>
          <a href="#" className="transition hover:text-[#3b2f26]">
            Оферта
          </a>
          <a href="#" className="transition hover:text-[#3b2f26]">
            Поддержка
          </a>
        </div>
      </Container>
    </footer>
  );
}
