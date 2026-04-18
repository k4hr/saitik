"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/ui/container";
import StepFaceUpload from "@/components/create/step-face-upload";
import StepReferenceUpload from "@/components/create/step-reference-upload";
import StepOrderSettings from "@/components/create/step-order-settings";
import OrderSummaryCard from "@/components/create/order-summary-card";
import ImageOrientationPicker from "@/components/create/image-orientation-picker";
import MultiFaceUpload, {
  type FaceGroup,
} from "@/components/create/multi-face-upload";
import type { UploadedClientAsset } from "@/components/create/r2-upload-input";

type GenerateResponse = {
  ok?: boolean;
  error?: string;
};

type ImageOrientation = "portrait" | "landscape" | "square";

const TOP_UP_PATH = "/pricing";

export default function ReferenceCreateShell() {
  const router = useRouter();

  const [faceAssets, setFaceAssets] = useState<UploadedClientAsset[]>([]);
  const [faceGroups, setFaceGroups] = useState<FaceGroup[]>([]);
  const [referenceAssets, setReferenceAssets] = useState<UploadedClientAsset[]>(
    [],
  );
  const [title, setTitle] = useState("Свой референс");
  const [notes, setNotes] = useState("");
  const [imageOrientation, setImageOrientation] =
    useState<ImageOrientation>("portrait");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const selectedStyle = {
    id: "reference-mode",
    title: "Свой референс",
    coverImageUrl: referenceAssets[0]?.publicUrl || null,
    generationPriceCredits: null,
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
          notes,
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

            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
                  Референс
                </p>
                <h2 className="mt-3 text-3xl leading-tight text-[#3d3128] sm:text-4xl">
                  Загрузка референса
                </h2>
              </div>

              <StepReferenceUpload
                value={referenceAssets}
                onChange={setReferenceAssets}
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
              disabled={allFaceAssets.length === 0 || referenceAssets.length === 0}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
