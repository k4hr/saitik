"use client";

import { useState } from "react";
import { WandSparkles } from "lucide-react";

import Container from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import R2UploadInput, {
  type UploadedClientAsset,
} from "@/components/create/r2-upload-input";
import GeneratedResultCard from "@/components/create/generated-result-card";
import ImageOrientationPicker from "@/components/create/image-orientation-picker";
import OrderSummaryCard from "@/components/create/order-summary-card";

type GenerateResponse = {
  ok?: boolean;
  error?: string;
  imagePath?: string;
  downloadPath?: string;
  sharePath?: string;
};

type ImageOrientation = "portrait" | "landscape" | "square";

type FreeEditShellProps = {
  currentBalance: number;
};

export default function FreeEditShell({
  currentBalance,
}: FreeEditShellProps) {
  const [sourceAssets, setSourceAssets] = useState<UploadedClientAsset[]>([]);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
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
    id: "edit-mode",
    title: "Свободное редактирование",
    coverImageUrl: null,
    generationPriceCredits: 15,
  };

  const hasEnoughCredits = currentBalance >= 15;

  async function handleGenerate() {
    if (!prompt.trim()) {
      setErrorText("Напиши промпт для генерации");
      return;
    }

    if (!hasEnoughCredits) {
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
          mode: "EDIT",
          title,
          prompt,
          imageOrientation,
          sourceAsset:
            sourceAssets.length > 0
              ? {
                  storageKey: sourceAssets[0].storageKey,
                  fileName: sourceAssets[0].fileName,
                  mimeType: sourceAssets[0].mimeType,
                  fileSize: sourceAssets[0].fileSize,
                }
              : null,
        }),
      });

      const data = (await response.json()) as GenerateResponse;

      if (
        !response.ok ||
        !data.imagePath ||
        !data.downloadPath ||
        !data.sharePath
      ) {
        throw new Error(data.error || "Не удалось создать изображение");
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
            Free edit
          </p>
          <h1 className="mt-4 text-4xl leading-[1.06] text-[#3d3128] sm:text-5xl lg:text-6xl">
            Свободное редактирование
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#726458] sm:text-lg">
            Можно загрузить исходное изображение и изменить его по промпту.
            Либо не загружать ничего и создать новую картинку только по текстовому
            описанию.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <ImageOrientationPicker
              value={imageOrientation}
              onChange={setImageOrientation}
            />

            <R2UploadInput
              title="Исходное изображение"
              description="Необязательно. Если загрузишь картинку, она будет отредактирована по твоему промпту. Если не загрузишь — система создаст изображение с нуля только по тексту."
              kind="edit-source"
              value={sourceAssets}
              onChange={setSourceAssets}
              maxFiles={1}
            />

            <Card>
              <CardHeader>
                <CardTitle>Свободный промпт</CardTitle>
                <CardDescription>
                  Опиши, что именно нужно сделать или какое изображение нужно создать.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm text-[#6f6156]">
                    Название задачи
                  </span>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Например: luxury portrait / заменить фон / создать fashion scene"
                  />
                </label>

                <Textarea
                  className="min-h-[220px]"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Например: создай дорогой editorial portrait в luxury интерьере, мягкий теплый свет, молочный пиджак, реалистичная кожа, премиальный фотореализм..."
                />

                <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
                  <div className="flex items-start gap-3">
                    <WandSparkles className="mt-0.5 size-5 text-[#a18672]" />
                    <div>
                      <p className="text-sm text-[#3d3128]">
                        Два сценария в одном режиме
                      </p>
                      <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                        С загрузкой исходника — редактирование изображения. Без
                        исходника — генерация новой картинки только по промпту.
                      </p>
                    </div>
                  </div>
                </div>

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
              </CardContent>
            </Card>
          </div>

          <div>
            <OrderSummaryCard
              selectedStyle={selectedStyle}
              submitText="Сгенерировать"
              onSubmit={handleGenerate}
              disabled={!prompt.trim()}
              isSubmitting={isSubmitting}
              currentBalance={currentBalance}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
