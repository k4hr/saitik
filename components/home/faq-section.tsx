import SectionShell from '@/components/layout/section-shell';

const faqItems = [
  {
    q: 'Сколько фото нужно загрузить?',
    a: 'Лучше всего 3–5 фото с разными ракурсами, хорошим светом и без сильных фильтров.',
  },
  {
    q: 'Можно ли загрузить свой референс?',
    a: 'Да. Для этого будет отдельный сценарий заказа, где пользователь загружает свою референс-картинку.',
  },
  {
    q: 'Сайт будет удобен с телефона?',
    a: 'Да. Интерфейс сразу делается mobile-first, чтобы с телефона было удобно выбирать стили, загружать фото и оплачивать.',
  },
  {
    q: 'Подходит ли для Instagram и дейтинга?',
    a: 'Да. Под это будут отдельные стили и пакеты, чтобы человек получал результат под конкретную цель.',
  },
];

export default function FAQSection() {
  return (
    <SectionShell
      id="faq"
      eyebrow="FAQ"
      title="Частые вопросы"
      description="Сразу закрываем основные сомнения пользователя перед заказом."
      className="bg-[#fbf7f3]"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {faqItems.map((item) => (
          <div
            key={item.q}
            className="rounded-[26px] border border-[#eadfd6] bg-white p-6 shadow-[0_10px_35px_rgba(88,62,40,0.05)]"
          >
            <h3 className="text-xl leading-tight text-[#3d3128]">{item.q}</h3>
            <p className="mt-3 text-sm leading-7 text-[#7e6f63]">{item.a}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
