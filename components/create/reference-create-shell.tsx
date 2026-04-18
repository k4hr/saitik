"use client";

import { useMemo, useState } from "react";

import Container from "@/components/ui/container";
import StepFaceUpload from "@/components/create/step-face-upload";
import StepReferenceUpload from "@/components/create/step-reference-upload";
import StepOrderSettings from "@/components/create/step-order-settings";
import OrderSummaryCard from "@/components/create/order-summary-card";
import GeneratedResultCard from "@/components/create/generated-result-card";
import ImageOrientationPicker from "@/components/create/image-orientation-picker";
import MultiFaceUpload, {
  type FaceGroup,
} from "@/components/create/multi-face-upload";
import type { UploadedClientAsset } from "@/components/create/r2-upload-input";

type GenerateResponse = {
  ok?: boolean;
  error?: string;
  imagePath?: string;
  downloadPath?: string;
  sharePath?: string;
};

type ImageOrientation = "portrait" | "landscape" | "square";

export default function ReferenceCreateShell() {
  const [faceAssets, setFaceAssets] = useState<UploadedClientAsset[]>([]);
  const [faceGroups, setFaceGroups] = useState<FaceGroup[]>([]);
  const [referenceAssets, setReferenceAssets] = useState<UploadedClientAsset[]>(
    [],
  );
  const [title, setTitle] = useState("Свой референс");
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

  const selectedStyle = {
    id: "reference-mode",
    title: "Свой референс",
    category: "Reference",
    description: "Генерация по загруженной референс-картинке пользователя.",
  };

  const allFaceAssets = useMemo(() => {
    const primary = faceAssets.map((item) => ({
      ...item,
      personIndex: 0,
    }));

    const grouped = faceGroups.flatMap((group) =>
      group.assets.map((asset) => ({
        ...asset,
        personIndex: group.personIndex,
      })),
    );

    return [...primary, ...grouped];
  }, [faceAssets, faceGroups]);

  async function handleGenerate() {
    if (allFaceAssets.length === 0) {
      setErrorText("Сначала загрузи хотя бы одно фото лица");
      return;
    }

    if (referenceAssets.length === 0) {
      setErrorText("Сначала загрузи референс");
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
          mode: "REFERENCE",
          title,
          goal,
          notes,
          selectedFormat,
          selectedMood,
          imageOrientation,
          faceAssets: allFaceAssets.map((item) => ({
            storageKey: item.storageKey,
            fileName: item.fileName,
            mimeType: item.mimeType,
            fileSize: item.fileSize,
            personIndex: item.personIndex,
          })),
          referenceAsset: {
            storageKey: referenceAssets[0].storageKey,
            fileName: referenceAssets[0].fileName,
            mimeType: referenceAssets[0].mimeType,
            fileSize: referenceAssets[0].fileSize,
          },
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
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Reference mode
          </p>
          <h1 className="mt-4 text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl lg:text-6xl">
            Создание по своему референсу
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Пользователь загружает лицо и референс. Система сначала анализирует
            референс, собирает чистый production prompt, а потом уже запускает
            генерацию.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <ImageOrientationPicker
              value={imageOrientation}
              onChange={setImageOrientation}
            />

            <StepFaceUpload value={faceAssets} onChange={setFaceAssets} />

            <MultiFaceUpload value={faceGroups} onChange={setFaceGroups} />

            <StepReferenceUpload
              value={referenceAssets}
              onChange={setReferenceAssets}
            />

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
              modeLabel="Свой референс"
              submitText="Сгенерировать"
              onSubmit={handleGenerate}
              disabled={allFaceAssets.length === 0 || referenceAssets.length === 0}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
