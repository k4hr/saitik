"use client";

import R2UploadInput, {
  type UploadedClientAsset,
} from "@/components/create/r2-upload-input";

type StepReferenceUploadProps = {
  value: UploadedClientAsset[];
  onChange: (value: UploadedClientAsset[]) => void;
};

export default function StepReferenceUpload({
  value,
  onChange,
}: StepReferenceUploadProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
          Шаг 3
        </p>
        <h2 className="mt-3 text-3xl text-[#3d3128]">Референс фотосессии</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7e6f63]">
          Загрузи референс. OpenAI сам опишет его по твоему мастер-промпту, а
          потом этот prompt пойдёт в генерацию.
        </p>
      </div>

      <R2UploadInput
        title="Референс"
        description="Загрузи пример, на который нужно ориентироваться по стилю, композиции, свету и атмосфере."
        kind="reference"
        value={value}
        onChange={onChange}
        maxFiles={1}
      />
    </div>
  );
}
