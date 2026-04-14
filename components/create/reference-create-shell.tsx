"use client";

import { useState } from "react";

import Container from "@/components/ui/container";
import StepFaceUpload from "@/components/create/step-face-upload";
import StepReferenceUpload from "@/components/create/step-reference-upload";
import StepOrderSettings from "@/components/create/step-order-settings";
import OrderSummaryCard from "@/components/create/order-summary-card";

const demoFaceFiles = ["face-main.jpg", "face-side-1.jpg", "face-side-2.jpg"];

export default function ReferenceCreateShell() {
  const [selectedFormat, setSelectedFormat] = useState<string>("Портрет");
  const [selectedMood, setSelectedMood] = useState<string>("Natural");

  const selectedStyle = {
    id: "reference-mode",
    title: "Свой референс",
    category: "Reference",
    description: "Генерация по загруженной референс-картинке пользователя.",
  };

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Reference mode
          </p>
          <h1 className="mt-4 text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl lg:text-6xl">
            Создание по своему референсу
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Здесь пользователь сразу загружает лицо и референс, а потом задает
            параметры заказа и запускает генерацию.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
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
