"use client";

import { ImagePlus, ShieldCheck, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import R2UploadInput, {
  type UploadedClientAsset,
} from "@/components/create/r2-upload-input";

type StepFaceUploadProps = {
  value: UploadedClientAsset[];
  onChange: (value: UploadedClientAsset[]) => void;
};

export default function StepFaceUpload({
  value,
  onChange,
}: StepFaceUploadProps) {
  return (
    <div className="space-y-4">
      <R2UploadInput
        title="Фото пользователя"
        description="Лучше всего 3–5 фото с хорошим светом, без масок, очков и сильных фильтров."
        kind="face"
        value={value}
        onChange={onChange}
        multiple
        maxFiles={5}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6]">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm text-[#a18672]">
              <Sparkles className="size-4" />
              Лучший результат
            </div>
            <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
              Фото анфас, хороший свет, чистое лицо в кадре.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6]">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm text-[#a18672]">
              <ShieldCheck className="size-4" />
              Стабильнее сходство
            </div>
            <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
              Несколько разных ракурсов помогают лучше сохранить черты.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#eadfd6] bg-[#fffaf6]">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm text-[#a18672]">
              <ImagePlus className="size-4" />
              Без помех
            </div>
            <p className="mt-2 text-sm leading-7 text-[#7e6f63]">
              Не используй фото с сильным блюром, обрезанным лицом и плохим светом.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
