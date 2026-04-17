"use client";

import { useState } from "react";
import { Sparkles, WandSparkles } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
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

type GenerateResponse = {
  ok?: boolean;
  error?: string;
  imagePath?: string;
  downloadPath?: string;
  sharePath?: string;
};

export default function FreeEditShell() {
  const [sourceAssets, setSourceAssets] = useState<UploadedClientAsset[]>([]);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [result, setResult] = useState<{
    imagePath: string;
    downloadPath: string;
    sharePath: string;
  } | null>(null);

  async function handleGenerate() {
    if (sourceAssets.length === 0) {
      setErrorText("Сначала загрузи изображение");
      return;
    }

    if (!prompt.trim()) {
      setErrorText("Напиши промпт для редактирования");
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
          sourceAsset: {
            storageKey: sourceAssets[0].storageKey,
            fileName: sourceAssets[0].fileName,
            mimeType: sourceAssets[0].mimeType,
            fileSize: sourceAssets[0].fileSize,
          },
        }),
      });

      const data = (await response.json()) as GenerateResponse;

      if (!response.ok || !data.imagePath || !data.downloadPath || !data.sharePath) {
        throw new Error(data.error || "Не удалось отредактировать изображение");
      }

      setResult({
        imagePath: data.imagePath,
        downloadPath: data.downloadPath,
        sharePath: data.sharePath,
      });
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Ошибка редактирования",
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
            Пользователь сам загружает исходное изображение и сам пишет промпт.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <R2UploadInput
              title="Исходное изображение"
              description="Загрузи фото или картинку, которую хочешь изменить."
              kind="edit-source"
              value={sourceAssets}
              onChange={setSourceAssets}
              maxFiles={1}
            />

            <Card>
              <CardHeader>
                <CardTitle>Свободный промпт</CardTitle>
                <CardDescription>
                  Опиши, что именно нужно сделать с изображением.
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
                    placeholder="Например: luxury portrait / заменить фон / изменить одежду"
                  />
                </label>

                <Textarea
                  className="min-h-[220px]"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Например: сделай из этого фото дорогой editorial portrait, сохрани лицо, измени одежду на молочный пиджак, замени фон на luxury interior, добавь мягкий теплый свет..."
                />

                <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
                  <div className="flex items-start gap-3">
                    <WandSparkles className="mt-0.5 size-5 text-[#a18672]" />
                    <div>
                      <p className="text-sm text-[#3d3128]">
                        Полностью свободный режим
                      </p>
                      <p className="mt-1 text-xs leading-6 text-[#7e6f63]">
                        Что написал пользователь, то и идёт в OpenAI edit pipeline.
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
            <Card className="sticky top-24 overflow-hidden">
              <div className="aspect-[1.18] bg-[linear-gradient(180deg,#e2d2c5_0%,#f4ece6_100%)]" />

              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-[#a18672]">
                  <Sparkles className="size-4" />
                  Сводка режима
                </div>

                <CardTitle className="mt-2">Свободное редактирование</CardTitle>

                <CardDescription>
                  Upload в R2 → OpenAI edit → показ результата → download/share.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-3 rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
                  <p className="text-sm text-[#3d3128]">Этот режим делает:</p>
                  <ul className="space-y-2 text-xs leading-6 text-[#7e6f63]">
                    <li>загрузку исходника</li>
                    <li>свободный пользовательский prompt</li>
                    <li>редактирование через OpenAI</li>
                    <li>выдачу результата на сайте</li>
                  </ul>
                </div>

                <Button
                  size="xl"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={isSubmitting || sourceAssets.length === 0 || !prompt.trim()}
                >
                  {isSubmitting ? "Обрабатываем..." : "Запустить редактирование"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
