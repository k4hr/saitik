"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/ui/container";
import StepFaceUpload from "@/components/create/step-face-upload";
import StepOrderSettings from "@/components/create/step-order-settings";
import OrderSummaryCard from "@/components/create/order-summary-card";
import ImageOrientationPicker from "@/components/create/image-orientation-picker";
import MultiFaceUpload, {
  type FaceGroup,
} from "@/components/create/multi-face-upload";
import type { UploadedClientAsset } from "@/components/create/r2-upload-input";

type SelectedReadyStyle = {
  id: string;
  title: string;
  category: string;
  description: string;
  promptTemplate?: string | null;
  coverImageUrl?: string | null;
  generationPriceCredits?: number | null;
};

type ReadyStyleCreateShellProps = {
  selectedStyle: SelectedReadyStyle;
};

type GenerateResponse = {
  ok?: boolean;
  error?: string;
  imagePath?: string;
  downloadPath?: string;
  sharePath?: string;
  chargedCredits?: number;
};

type ImageOrientation = "portrait" | "landscape" | "square";

const TOP_UP_PATH = "/pricing";

export default function ReadyStyleCreateShell({
  selectedStyle,
}: ReadyStyleCreateShellProps) {
  const router = useRouter();

  const [faceAssets, setFaceAssets] = useState<UploadedClientAsset[]>([]);
  const [faceGroups, setFaceGroups] = useState<FaceGroup[]>([]);
  const [title, setTitle] = useState(selectedStyle.title || "");
  const [notes, setNotes] = useState("");
  const [imageOrientation, setImageOrientation] =
    useState<ImageOrientation>("portrait");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

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
          showcaseItemId: selectedStyle.id,
          title,
          notes,
          imageOrientation,
          faceAssets: allFaceAssets.map((item) => ({
            storageKey: item.storageKey,
            fileName: item.fileName,
            mimeType: item.mimeType,
            fileSize: item.fileSize,
            personIndex: item.personIndex,
          })),
        }),
      });

      const data = (await response.json()) as GenerateResponse;

      if (!response.ok) {
        if (data.error === "Недостаточно кредитов") {
          router.push(TOP_UP_PATH);
          return;
        }

        throw new Error(data.error || "Не удалось сгенерировать изображение");
      }

      router.push("/dashboard/orders");
      router.refresh();
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
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                  Шаг 1
                </p>
                <h2 className="mt-3 text-3xl leading-tight text-[#3d3128] sm:text-4xl">
                  Загрузка лица
                </h2>
              </div>

              <StepFaceUpload value={faceAssets} onChange={setFaceAssets} />
              <MultiFaceUpload value={faceGroups} onChange={setFaceGroups} />
            </section>

            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                  Шаг 2
                </p>
                <h2 className="mt-3 text-3xl leading-tight text-[#3d3128] sm:text-4xl">
                  Ориентация картинки
                </h2>
              </div>

              <ImageOrientationPicker
                value={imageOrientation}
                onChange={setImageOrientation}
              />
            </section>

            <StepOrderSettings
              title={title}
              notes={notes}
              onTitleChange={setTitle}
              onNotesChange={setNotes}
            />

            {errorText ? (
              <div className="rounded-[18px] border border-[#e7c7bf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4f43]">
                {errorText}
              </div>
            ) : null}
          </div>

          <div>
            <OrderSummaryCard
              selectedStyle={selectedStyle}
              submitText="Сгенерировать"
              onSubmit={handleGenerate}
              disabled={allFaceAssets.length === 0}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
