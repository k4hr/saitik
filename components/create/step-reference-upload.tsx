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
    <R2UploadInput
      title="Референс"
      description="Загрузи пример, на который нужно ориентироваться по стилю, композиции, свету и атмосфере."
      kind="reference"
      value={value}
      onChange={onChange}
      maxFiles={1}
    />
  );
}
