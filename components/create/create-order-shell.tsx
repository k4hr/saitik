"use client";

import { useMemo, useState } from "react";

import Container from "@/components/ui/container";
import StepStylePicker from "@/components/create/step-style-picker";
import StepFaceUpload from "@/components/create/step-face-upload";
import StepReferenceUpload from "@/components/create/step-reference-upload";
import StepOrderSettings from "@/components/create/step-order-settings";
import OrderSummaryCard from "@/components/create/order-summary-card";
import { stylePresets, type StyleOption } from "@/lib/data/style-presets";

type CreateOrderShellProps = {
  initialStyleId?: string;
};

const demoFaceFiles = ["face-main.jpg", "face-side-1.jpg", "face-side-2.jpg"];

export default function CreateOrderShell({ initialStyleId }: CreateOrderShellProps) {
  const fallbackStyleId =
    initialStyleId && stylePresets.some((item) => item.id === initialStyleId)
      ? initialStyleId
      : stylePresets[0].id;

  const [selectedStyleId, setSelectedStyleId] = useState<string>(fallbackStyleId);
  const [selectedFormat, setSelectedFormat] = useState<string>("Портрет");
  const [selectedMood, setSelectedMood] = useState<string>("Luxury");

  const selectedStyle = useMemo<StyleOption | undefined>(
    () => stylePresets.find((item) => item.id === selectedStyleId),
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
            Это уже основа product flow ATELIA: email-аккаунт, стиль,
            загрузка лица, референс, параметры заказа и списание кредитов.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <StepStylePicker
              items={stylePresets}
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
