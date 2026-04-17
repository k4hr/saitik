"use client";

import { useState } from "react";

import Container from "@/components/ui/container";
import StepFaceUpload from "@/components/create/step-face-upload";
import StepOrderSettings from "@/components/create/step-order-settings";
import OrderSummaryCard from "@/components/create/order-summary-card";
import GeneratedResultCard from "@/components/create/generated-result-card";
import type { StyleOption } from "@/lib/data/style-presets";
import type { UploadedClientAsset } from "@/components/create/r2-upload-input";

type ReadyStyleCreateShellProps = {
  selectedStyle: StyleOption;
};

type GenerateResponse = {
  ok?: boolean;
  error?: string;
  imagePath?: string;
  downloadPath?: string;
  sharePath?: string;
};

export default function ReadyStyleCreateShell({
  selectedStyle,
}: ReadyStyleCreateShellProps) {
  const [faceAssets, setFaceAssets] = useState<UploadedClientAsset[]>([]);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("Портрет");
  const [selectedMood, setSelectedMood] = useState<string>("Natural");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [result, setResult] = useState<{
    imagePath: string;
    downloadPath: string;
    sharePath: string;
  } | null>(null);

  async function handleGenerate() {
    if (faceAssets.length === 0) {
      setErrorText("Сначала загрузи хотя бы одно фото лица");
      return;
    }

    setErrorText("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "READY",
          stylePresetId: selectedStyle.id,
          title,
          goal,
          notes,
          selectedFormat,
          selectedMood,
          faceAssets: faceAssets.map((item) => ({
            storageKey: item.storageKey,
            fileName: item.fileName,
            mimeType: item.mimeType,
            fileSize: item.fileSize,
          })),
        }),
      });

      const data = (await response.json()) as GenerateResponse;

      if (!response.ok || !data.imagePath || !data.downloadPath || !data.sharePath) {
        throw new Error(data.error || "Не удалось сгенерировать изображение");
      }

      setResult({
        imagePath: data.imagePath,
        downloadPath: data.downloadPath,
        sharePath: data.sharePath,
      });
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Ошибка генерации",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Выбранный стиль
          </p>
          <h1 className="mt-4 text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl lg:text-6xl">
            {selectedStyle.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Для этого стиля уже зашит готовый prompt template. Пользователь
            загружает лицо, а дальше API генерирует такую же эстетику с его лицом.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <StepFaceUpload value={faceAssets} onChange={setFaceAssets} />

            <StepOrderSettings
              title={title}
              goal={goal}
              notes={notes}
              selectedFormat={selectedFormat}
              selectedMood={selectedMood}
              onTitleChange={setTitle}
              onGoalChange={setGoal}
              onNotesChange={setNotes}
              onFormatSelect={setSelectedFormat}
              onMoodSelect={setSelectedMood}
            />

            {errorText ? (
              <div className="rounded-[18px] border border-[#e7c7bf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4f43]">
                {errorText}
              </div>
            ) : null}

            {result ? (
              <GeneratedResultCard
                imagePath={result.imagePath}
                downloadPath={result.downloadPath}
                sharePath={result.sharePath}
              />
            ) : null}
          </div>

          <div>
            <OrderSummaryCard
              selectedStyle={selectedStyle}
              selectedFormat={selectedFormat}
              selectedMood={selectedMood}
              modeLabel="Готовый стиль"
              submitText="Сгенерировать"
              onSubmit={handleGenerate}
              disabled={faceAssets.length === 0}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
