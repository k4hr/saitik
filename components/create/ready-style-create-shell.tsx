"use client";

import { useState } from "react";

import Container from "@/components/ui/container";
import StepFaceUpload from "@/components/create/step-face-upload";
import StepOrderSettings from "@/components/create/step-order-settings";
import OrderSummaryCard from "@/components/create/order-summary-card";
import GeneratedResultCard from "@/components/create/generated-result-card";
import ImageOrientationPicker from "@/components/create/image-orientation-picker";
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

type ImageOrientation = "portrait" | "landscape" | "square";

export default function ReadyStyleCreateShell({
  selectedStyle,
}: ReadyStyleCreateShellProps) {
  const [faceAssets, setFaceAssets] = useState<UploadedClientAsset[]>([]);
  const [title, setTitle] = useState(selectedStyle.title || "");
  const [goal, setGoal] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("Портрет");
  const [selectedMood, setSelectedMood] = useState<string>("Natural");
  const [imageOrientation, setImageOrientation] =
    useState<ImageOrientation>("portrait");
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
          imageOrientation,
          faceAssets: faceAssets.map((item) => ({
            storageKey: item.storageKey,
            fileName: item.fileName,
            mimeType: item.mimeType,
            fileSize: item.fileSize,
          })),
        }),
      });

      const data = (await response.json()) as GenerateResponse;

      if (
        !response.ok ||
        !data.imagePath ||
        !data.downloadPath ||
        !data.sharePath
      ) {
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
        <div className="mb-10 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Выбранный образ
          </p>

          <h1 className="mt-4 text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl lg:text-6xl">
            {selectedStyle.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Этот образ уже связан со своим готовым промптом. Пользователь
            добавляет лицо, а дальше генерация идёт по promptTemplate выбранного
            style preset.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[30px] border border-[#eadfd6] bg-white/90 shadow-[0_14px_36px_rgba(95,69,48,0.06)]">
              <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                <div className="bg-[#f5ece6]">
                  {selectedStyle.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedStyle.coverImageUrl}
                      alt={selectedStyle.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[0.82] h-full w-full bg-[linear-gradient(180deg,#ddd0c6_0%,#f4ece6_100%)]" />
                  )}
                </div>

                <div className="space-y-5 p-6 sm:p-7">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                      Образ сохранён
                    </p>
                    <h2 className="mt-3 text-2xl text-[#3d3128]">
                      {selectedStyle.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7e6f63]">
                      {selectedStyle.description ||
                        "Для этого образа уже зашит отдельный promptTemplate."}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
                    <p className="text-sm text-[#3d3128]">
                      На этой странице пользователь только загружает своё лицо и
                      выбирает параметры генерации. Сам промпт уже привязан к
                      выбранному образу через админку.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ImageOrientationPicker
              value={imageOrientation}
              onChange={setImageOrientation}
            />

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
