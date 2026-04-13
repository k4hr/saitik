"use client";

import { ImagePlus, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StepFaceUploadProps = {
  files: string[];
};

export default function StepFaceUpload({ files }: StepFaceUploadProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
          Шаг 2
        </p>
        <h2 className="mt-3 text-3xl text-[#3d3128]">Загрузка лица</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7e6f63]">
          Пока это визуальная заготовка UI. Здесь позже подключим реальный upload
          в R2 или S3 и валидацию качества исходных фото.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Фото пользователя</CardTitle>
          <CardDescription>
            Лучше всего 3–5 фото с хорошим светом, без масок, очков и сильных фильтров.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-[28px] border border-dashed border-[#d8c5b7] bg-[#fffaf6] p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#f2e6db] text-[#9d7b62]">
                <ImagePlus className="size-6" />
              </div>

              <h3 className="mt-4 text-xl text-[#3d3128]">
                Перетащи фото сюда или выбери с устройства
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-7 text-[#7e6f63]">
                На следующем этапе мы заменим этот блок на реальный upload input
                с превью, проверкой размера файла и форматов.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Badge variant="outline">JPG</Badge>
                <Badge variant="outline">PNG</Badge>
                <Badge variant="outline">до 10 MB</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {files.map((item, index) => (
              <div
                key={item}
                className="overflow-hidden rounded-[24px] border border-[#eadfd6] bg-white"
              >
                <div
                  className={`aspect-[0.92] ${
                    index % 3 === 0
                      ? "bg-[linear-gradient(180deg,#ddd0c6_0%,#f4ece6_100%)]"
                      : index % 3 === 1
                        ? "bg-[linear-gradient(180deg,#d2bcad_0%,#efe5de_100%)]"
                        : "bg-[linear-gradient(180deg,#eadfd6_0%,#faf5f1_100%)]"
                  }`}
                />
                <div className="p-4">
                  <p className="text-sm text-[#3d3128]">{item}</p>
                  <p className="mt-1 text-xs text-[#8f7f73]">пример превью</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
              <div className="flex items-center gap-2 text-sm text-[#a18672]">
                <Sparkles className="size-4" />
                Лучший результат
              </div>
              <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                Фото анфас, хороший свет, чистое лицо в кадре.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
              <div className="flex items-center gap-2 text-sm text-[#a18672]">
                <ShieldCheck className="size-4" />
                Стабильнее сходство
              </div>
              <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                Несколько разных ракурсов помогают лучше сохранить черты.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6] p-5">
              <div className="flex items-center gap-2 text-sm text-[#a18672]">
                <ImagePlus className="size-4" />
                Без помех
              </div>
              <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
                Не использовать фото с обрезанным лицом или сильным блюром.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
