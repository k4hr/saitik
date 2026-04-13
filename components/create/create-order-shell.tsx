"use client";

import { useMemo, useState } from "react";

import Container from "@/components/ui/container";
import StepStylePicker, { type StyleOption } from "@/components/create/step-style-picker";
import StepFaceUpload from "@/components/create/step-face-upload";
import StepReferenceUpload from "@/components/create/step-reference-upload";
import StepOrderSettings from "@/components/create/step-order-settings";
import OrderSummaryCard from "@/components/create/order-summary-card";

const styleOptions: StyleOption[] = [
  {
    id: "old-money-portrait",
    title: "Old Money Portrait",
    category: "Luxury",
    description: "Тихая роскошь, мягкий свет и дорогой спокойный образ."
  },
  {
    id: "pinterest-soft",
    title: "Pinterest Soft",
    category: "Pinterest",
    description: "Нежные оттенки, воздушная эстетика и премиальный мягкий вайб."
  },
  {
    id: "business-clean",
    title: "Business Clean",
    category: "Business",
    description: "Чистые деловые кадры для сайта, LinkedIn и личного бренда."
  },
  {
    id: "dating-premium",
    title: "Dating Premium",
    category: "Dating",
    description: "Живые естественные фото, которые выглядят дорого и цепляют."
  },
  {
    id: "travel-luxury",
    title: "Travel Luxury",
    category: "Travel",
    description: "Картинка как из отпуска мечты с премиальной подачей."
  },
  {
    id: "editorial-vogue",
    title: "Editorial Vogue",
    category: "Editorial",
    description: "Журнальная композиция, выразительный портрет и fashion-подача."
  }
];

const demoFaceFiles = [
  "face-main.jpg",
  "face-side-1.jpg",
  "face-side-2.jpg"
];

export default function CreateOrderShell() {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(styleOptions[0].id);
  const [selectedFormat, setSelectedFormat] = useState<string>("Портрет");
  const [selectedMood, setSelectedMood] = useState<string>("Luxury");

  const selectedStyle = useMemo(
    () => styleOptions.find((item) => item.id === selectedStyleId),
    [selectedStyleId]
  );

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Create order
          </p>
          <h1 className="mt-4 text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl lg:text-6xl">
            Собери заказ на AI-фотосессию
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Это уже основа будущего product flow: выбор стиля, загрузка лица,
            референс и параметры заказа в одном премиальном интерфейсе.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <StepStylePicker
              items={styleOptions}
              selectedStyleId={selectedStyleId}
              onSelectStyle={setSelectedStyleId}
            />

            <StepFaceUpload files={demoFaceFiles} />

            <StepReferenceUpload />

            <StepOrderSettings
              selectedFormat={selectedFormat}
              selectedMood={selectedMood}
              onFormatSelect={setSelectedFormat}
              onMoodSelect={setSelectedMood}
            />
          </div>

          <div>
            <OrderSummaryCard
              selectedStyle={selectedStyle}
              selectedFormat={selectedFormat}
              selectedMood={selectedMood}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
