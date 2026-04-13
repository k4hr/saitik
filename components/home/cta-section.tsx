import Container from '@/components/ui/container';

export default function CTASection() {
  return (
    <section className="bg-[#f6efe9] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="rounded-[36px] border border-[#e5d7cb] bg-[linear-gradient(180deg,#fffaf6_0%,#f4ebe4_100%)] px-6 py-10 text-center shadow-[0_18px_60px_rgba(88,62,40,0.08)] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <p className="text-xs uppercase tracking-[0.24em] text-[#a18672]">
            Готов к запуску
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl leading-tight text-[#3d3128] sm:text-4xl lg:text-5xl">
            Сделай первую AI-фотосессию в премиальном стиле
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#7e6f63] sm:text-base">
            Выбирай готовую эстетику, загружай свои фото и получай изображения,
            которые выглядят как результат дорогой реальной съёмки.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#styles"
              className="inline-flex items-center justify-center rounded-full bg-[#b79273] px-7 py-3.5 text-sm text-white transition hover:bg-[#a88466]"
            >
              Начать
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full border border-[#d8c5b7] px-7 py-3.5 text-sm text-[#5f5248] transition hover:bg-[#efe4db]"
            >
              Посмотреть тарифы
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
