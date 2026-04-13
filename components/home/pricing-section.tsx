import SectionShell from '@/components/layout/section-shell';

const plans = [
  {
    name: 'Start',
    price: '990 ₽',
    desc: 'Для первого знакомства с сервисом.',
    features: ['1 стиль', '8 фото', 'Стандартное качество'],
    featured: false,
  },
  {
    name: 'Premium',
    price: '2 490 ₽',
    desc: 'Оптимально для красивой полноценной серии.',
    features: ['3 стиля', '20 фото', '1 reroll', 'Повышенное качество'],
    featured: true,
  },
  {
    name: 'Reference Pro',
    price: '3 990 ₽',
    desc: 'Если пользователь загружает свой референс.',
    features: ['Свой референс', '12 фото', 'Приоритетная генерация'],
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <SectionShell
      id="pricing"
      eyebrow="Тарифы"
      title="Пакеты под разный сценарий"
      description="Можно начать с базового варианта, а можно сразу брать продвинутый режим со своим референсом."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-[30px] border p-7 shadow-[0_10px_35px_rgba(88,62,40,0.06)] ${
              plan.featured
                ? 'border-[#caa789] bg-[#fffaf6]'
                : 'border-[#eadfd6] bg-white'
            }`}
          >
            {plan.featured ? (
              <span className="inline-flex rounded-full bg-[#f1e0d1] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#9a7658]">
                Popular
              </span>
            ) : null}

            <h3 className="mt-4 text-3xl text-[#3d3128]">{plan.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[#7e6f63]">{plan.desc}</p>
            <p className="mt-6 text-4xl text-[#3d3128]">{plan.price}</p>

            <ul className="mt-6 space-y-3 text-sm text-[#6d5f54]">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>

            <button
              className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm transition ${
                plan.featured
                  ? 'bg-[#b79273] text-white hover:bg-[#a88466]'
                  : 'border border-[#d8c5b7] text-[#5f5248] hover:bg-[#f2e7de]'
              }`}
            >
              Выбрать тариф
            </button>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
