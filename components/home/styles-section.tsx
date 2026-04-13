import SectionShell from '@/components/layout/section-shell';

const styles = [
  {
    title: 'Old Money',
    text: 'Тихая роскошь, мягкий свет, дорогой спокойный образ.',
  },
  {
    title: 'Pinterest Soft',
    text: 'Воздушная эстетика, нежные тона и ощущение идеальной фотосессии.',
  },
  {
    title: 'Business',
    text: 'Чистые деловые кадры для LinkedIn, сайта и личного бренда.',
  },
  {
    title: 'Dating Premium',
    text: 'Сильные живые фото, которые выглядят естественно и дорого.',
  },
  {
    title: 'Travel Luxury',
    text: 'Картинка как из отпуска мечты: свет, стиль и premium вайб.',
  },
  {
    title: 'Editorial',
    text: 'Fashion-подача, журнальная композиция и выразительные портреты.',
  },
];

export default function StylesSection() {
  return (
    <SectionShell
      id="styles"
      eyebrow="Каталог образов"
      title="Выбирай готовую эстетику, а не думай над промптом"
      description="Пользователь просто выбирает понятный стиль, а не разбирается в сложных настройках и формулировках."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {styles.map((item, index) => (
          <div
            key={item.title}
            className="group overflow-hidden rounded-[30px] border border-[#eadfd6] bg-white shadow-[0_10px_35px_rgba(88,62,40,0.06)] transition hover:-translate-y-1"
          >
            <div
              className={`aspect-[1/1.18] ${
                index % 3 === 0
                  ? 'bg-[linear-gradient(180deg,#dac7b8_0%,#f3ebe5_100%)]'
                  : index % 3 === 1
                    ? 'bg-[linear-gradient(180deg,#e8ddd3_0%,#f8f3ee_100%)]'
                    : 'bg-[linear-gradient(180deg,#ccb7a8_0%,#efe5de_100%)]'
              }`}
            />
            <div className="p-6">
              <h3 className="text-2xl text-[#3d3128]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#7e6f63]">{item.text}</p>
              <button className="mt-5 inline-flex rounded-full border border-[#d8c5b7] px-4 py-2 text-sm text-[#5f5248] transition hover:bg-[#f2e7de]">
                Выбрать стиль
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
