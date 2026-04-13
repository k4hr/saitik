import SectionShell from '@/components/layout/section-shell';

const steps = [
  {
    number: '01',
    title: 'Загрузи свои фото',
    text: 'Добавь 1–5 фотографий лица. Чем чище свет и ракурсы, тем лучше итоговая фотосессия.',
  },
  {
    number: '02',
    title: 'Выбери стиль или референс',
    text: 'Можно взять готовую эстетичную фотосессию из каталога или загрузить свою референс-картинку.',
  },
  {
    number: '03',
    title: 'Оплати и запусти генерацию',
    text: 'После оплаты заказ отправляется в обработку, а система собирает для тебя серию кадров.',
  },
  {
    number: '04',
    title: 'Получи готовые фото',
    text: 'Скачай готовые изображения и используй их для Instagram, дейтинга, аватарок или бренда.',
  },
];

export default function HowItWorksSection() {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="Пошагово"
      title="Простой путь от селфи до стильной AI-фотосессии"
      description="Максимально понятный сценарий: загрузка, выбор стиля, оплата и готовый результат."
      className="bg-[#fbf7f3]"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-[28px] border border-[#eadfd6] bg-white p-6 shadow-[0_10px_35px_rgba(88,62,40,0.06)]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#b28e72]">
              {step.number}
            </p>
            <h3 className="mt-4 text-2xl leading-tight text-[#3d3128]">
              {step.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#7e6f63]">{step.text}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
