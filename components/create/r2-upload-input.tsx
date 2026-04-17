"use client";

import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type UploadedClientAsset = {
  storageKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  previewUrl: string;
};

type UploadKind = "face" | "reference" | "edit-source";

type R2UploadInputProps = {
  title: string;
  description: string;
  kind: UploadKind;
  value: UploadedClientAsset[];
  onChange: (value: UploadedClientAsset[]) => void;
  multiple?: boolean;
  maxFiles?: number;
};

export default function R2UploadInput({
  title,
  description,
  kind,
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
}: R2UploadInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function uploadSingleFile(file: File): Promise<UploadedClientAsset> {
    const signResponse = await fetch("/api/uploads/sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        kind,
      }),
    });

    const signData = (await signResponse.json()) as {
      ok?: boolean;
      error?: string;
      signedUrl?: string;
      key?: string;
    };

    if (!signResponse.ok || !signData.signedUrl || !signData.key) {
      throw new Error(signData.error || "Не удалось подписать загрузку");
    }

    const uploadResponse = await fetch(signData.signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Не удалось загрузить файл в облако");
    }

    return {
      storageKey: signData.key,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      previewUrl: URL.createObjectURL(file),
    };
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setErrorText("");
    setIsUploading(true);

    try {
      const incoming = Array.from(files).slice(0, maxFiles);
      const uploaded: UploadedClientAsset[] = [];

      for (const file of incoming) {
        uploaded.push(await uploadSingleFile(file));
      }

      onChange(multiple ? [...value, ...uploaded].slice(0, maxFiles) : uploaded);
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Ошибка загрузки файла",
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemove(index: number) {
    const next = value.filter((_, itemIndex) => itemIndex !== index);
    onChange(next);
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-6 p-6 sm:p-7">
        <div>
          <h3 className="text-xl text-[#3d3128]">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#7e6f63]">{description}</p>
        </div>

        <div className="rounded-[28px] border border-dashed border-[#d8c5b7] bg-[#fffaf6] p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-[#f2e6db] text-[#9d7b62]">
              {isUploading ? (
                <LoaderCircle className="size-6 animate-spin" />
              ) : (
                <ImagePlus className="size-6" />
              )}
            </div>

            <h3 className="mt-4 text-xl text-[#3d3128]">
              {isUploading ? "Загрузка..." : "Выбери изображение"}
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-7 text-[#7e6f63]">
              JPG, PNG, WEBP. Загрузка идёт сразу в Cloudflare R2.
            </p>

            <div className="mt-5">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple={multiple}
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
              />

              <Button
                type="button"
                size="lg"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                Выбрать файл
              </Button>
            </div>
          </div>
        </div>

        {errorText ? (
          <div className="rounded-[18px] border border-[#e7c7bf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4f43]">
            {errorText}
          </div>
        ) : null}

        {value.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {value.map((item, index) => (
              <div
                key={`${item.storageKey}-${index}`}
                className="overflow-hidden rounded-[24px] border border-[#eadfd6] bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={item.fileName}
                  className="aspect-[0.92] w-full object-cover"
                />

                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#3d3128]">
                      {item.fileName}
                    </p>
                    <p className="mt-1 text-xs text-[#8f7f73]">
                      {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[#eadfd6] bg-white text-[#7e6f63] transition hover:bg-[#fff5ef]"
                    aria-label="Удалить"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
