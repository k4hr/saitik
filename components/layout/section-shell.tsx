import SectionShell from "@/components/layout/section-shell";

const steps = [
  {
    number: "01",
    title: "Выберите стиль фотографии который желаете получить",
    text: "Выберите стиль будущей фотосессии из каталога готовых образов.",
  },
  {
    number: "02",
    title: "Загрузите фотографию Вашего лица",
    text: "Подойдет обычное фото с телефона. Главное, чтобы лицо было хорошо видно.",
  },
  {
    number: "03",
    title: "Получите профессиональные кадры",
    text: "Сервис создаст стильную фотосессию с Вашим лицом в выбранной эстетике.",
  },
];

export default function HowItWorksSection() {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="КАК ЭТО ПРОИСХОДИТ?"
      title="Простой путь от селфи до стильной фотосессии"
      className="bg-[#fbf7f3]"
    >
      <div className="grid gap-4 md:grid-cols-3">
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
