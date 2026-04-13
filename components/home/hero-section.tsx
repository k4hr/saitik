import Container from '@/components/ui/container';

const tags = [
  'Pinterest aesthetic',
  'Luxury portrait',
  'Dating photos',
  'Business look',
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(248,242,237,1)_55%)]"
    >
      <Container className="grid min-h-[calc(100vh-64px)] items-center gap-10 py-12 sm:min-h-[calc(100vh-80px)] sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-20">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#a18672]">
            AI premium photo studio
          </p>

          <h1 className="max-w-3xl text-4xl leading-[1.05] text-[#3d3128] sm:text-5xl lg:text-7xl">
            Фотосессия как на Pinterest — с твоим лицом
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Загрузи свои фото, выбери готовый стиль или добавь референс и получи
            серию премиальных кадров, которые выглядят как дорогая реальная
            съёмка.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#styles"
              className="inline-flex items-center justify-center rounded-full bg-[#b79273] px-7 py-3.5 text-sm text-white transition hover:bg-[#a88466]"
            >
              Выбрать стиль
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-[#d8c5b7] px-7 py-3.5 text-sm text-[#5f5248] transition hover:bg-[#efe4db]"
            >
              Как это работает
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#e5d6ca] bg-white/70 px-4 py-2 text-xs text-[#7b6c61] backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[#e7dbd1] pt-6">
            <div>
              <p className="text-2xl text-[#3d3128] sm:text-3xl">5 мин</p>
              <p className="mt-2 text-sm text-[#7b6c61]">среднее время заказа</p>
            </div>
            <div>
              <p className="text-2xl text-[#3d3128] sm:text-3xl">20+</p>
              <p className="mt-2 text-sm text-[#7b6c61]">готовых стилей</p>
            </div>
            <div>
              <p className="text-2xl text-[#3d3128] sm:text-3xl">4K</p>
              <p className="mt-2 text-sm text-[#7b6c61]">доступно в Pro</p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-4 sm:space-y-5">
              <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[#e9ddd2] shadow-[0_18px_60px_rgba(88,62,40,0.10)]">
                <div className="aspect-[0.78] bg-[linear-gradient(180deg,#d8c5b7_0%,#f3ebe5_100%)]" />
              </div>
              <div className="rounded-[24px] border border-[#eadfd6] bg-white/65 p-5 backdrop-blur-sm">
                <p className="text-sm text-[#a18672]">Референс или шаблон</p>
                <p className="mt-2 text-lg leading-7 text-[#3d3128]">
                  Выбирай готовую фотосессию или загружай свою картинку.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8 sm:space-y-5 sm:pt-10">
              <div className="rounded-[24px] border border-[#eadfd6] bg-white/70 p-5 backdrop-blur-sm">
                <p className="text-sm text-[#a18672]">Идеально под телефон</p>
                <p className="mt-2 text-lg leading-7 text-[#3d3128]">
                  Загрузка фото, оплата и просмотр результата без лишних шагов.
                </p>
              </div>
              <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[#eadfd6] shadow-[0_18px_60px_rgba(88,62,40,0.10)]">
                <div className="aspect-[0.78] bg-[linear-gradient(180deg,#cdb7a7_0%,#f7f0ea_100%)]" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
