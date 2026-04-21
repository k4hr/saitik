"use client";

import { useMemo, useRef, useState } from "react";
import { ShowcaseKind } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type SubcategoryOption = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
};

type ShowcaseItemCreateFormProps = {
  kind: ShowcaseKind;
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  suggestedSortOrder: number;
};

const ALLOWED_COVER_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_COVER_FILE_SIZE = 15 * 1024 * 1024;

export default function ShowcaseItemCreateForm({
  kind,
  categories,
  subcategories,
  suggestedSortOrder,
}: ShowcaseItemCreateFormProps) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [promptTemplate, setPromptTemplate] = useState("");
  const [generationPriceCredits, setGenerationPriceCredits] = useState("10");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [sortOrder, setSortOrder] = useState(String(suggestedSortOrder));
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const previewSlug = useMemo(() => {
    return slugTouched ? slugify(slug) : slugify(title);
  }, [title, slug, slugTouched]);

  const visibleSubcategories = useMemo(() => {
    return subcategories.filter((item) => item.categoryId === categoryId);
  }, [subcategories, categoryId]);

  const isReady = kind === ShowcaseKind.READY;

  async function handleCoverUpload(file: File) {
    if (!ALLOWED_COVER_TYPES.has(file.type)) {
      setErrorText("Для обложки разрешены только JPG, PNG, WEBP");
      return;
    }

    if (file.size > MAX_COVER_FILE_SIZE) {
      setErrorText("Обложка слишком большая. Максимум 15 MB.");
      return;
    }

    setErrorText("");
    setIsUploadingCover(true);

    try {
      const signResponse = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
          kind: "showcase-cover",
        }),
      });

      const signData = (await signResponse.json()) as {
        ok?: boolean;
        error?: string;
        signedUrl?: string;
        publicUrl?: string | null;
      };

      if (!signResponse.ok || !signData.signedUrl || !signData.publicUrl) {
        throw new Error(signData.error || "Не удалось подготовить загрузку обложки");
      }

      const uploadResponse = await fetch(signData.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Не удалось загрузить обложку");
      }

      setCoverImageUrl(signData.publicUrl);
      setCoverPreviewUrl(URL.createObjectURL(file));
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Ошибка загрузки обложки",
      );
    } finally {
      setIsUploadingCover(false);

      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorText("");
    setSuccessText("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/showcase-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug: slugTouched ? slug : title,
          kind,
          description,
          promptTemplate: isReady ? promptTemplate : null,
          generationPriceCredits: isReady ? generationPriceCredits : null,
          coverImageUrl,
          categoryId,
          subcategoryId: subcategoryId || null,
          sortOrder,
          isActive,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok) {
        setErrorText(data.error || "Не удалось создать карточку");
        setIsSubmitting(false);
        return;
      }

      setSuccessText("Карточка успешно создана");
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setDescription("");
      setPromptTemplate("");
      setGenerationPriceCredits("10");
      setCoverImageUrl("");
      setCoverPreviewUrl("");
      setSubcategoryId("");
      setSortOrder(String(Number(sortOrder || 0) + 10));
      setIsActive(true);
      router.refresh();
    } catch {
      setErrorText("Ошибка сети. Попробуй ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="showcase-title"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Название карточки
        </label>
        <Input
          id="showcase-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={
            isReady
              ? "Например: Old Money Men 1"
              : "Например: Pinterest Reference Set"
          }
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="showcase-slug"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Slug
        </label>
        <Input
          id="showcase-slug"
          value={slugTouched ? slug : previewSlug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          placeholder="old-money-men-1"
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="showcase-description"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Описание
        </label>
        <Textarea
          id="showcase-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Короткое описание карточки витрины."
        />
      </div>

      {isReady ? (
        <>
          <div>
            <label
              htmlFor="showcase-prompt"
              className="mb-2 block text-sm font-medium text-[#6f6156]"
            >
              Изначальный промпт
            </label>
            <Textarea
              id="showcase-prompt"
              value={promptTemplate}
              onChange={(event) => setPromptTemplate(event.target.value)}
              placeholder="Именно по этому промпту потом будет генерироваться изображение пользователя."
              className="min-h-[220px]"
            />
          </div>

          <div>
            <label
              htmlFor="showcase-price"
              className="mb-2 block text-sm font-medium text-[#6f6156]"
            >
              Цена генерации в кредитах
            </label>
            <Input
              id="showcase-price"
              type="number"
              inputMode="numeric"
              min={0}
              value={generationPriceCredits}
              onChange={(event) => setGenerationPriceCredits(event.target.value)}
              placeholder="Например: 10"
            />
          </div>
        </>
      ) : null}

      <div className="space-y-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#6f6156]">
            Обложка
          </label>

          <div className="rounded-[24px] border border-dashed border-[#dfd1c4] bg-[#fffaf6] p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleCoverUpload(file);
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                >
                  {isUploadingCover ? (
                    <>
                      <LoaderCircle className="size-4.5 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="size-4.5" />
                      Загрузить PNG / JPG
                    </>
                  )}
                </Button>

                <p className="text-xs text-[#8f7f73]">
                  Разрешены JPG, PNG, WEBP. Максимум 15 MB.
                </p>
              </div>

              {(coverPreviewUrl || coverImageUrl) ? (
                <div className="overflow-hidden rounded-[20px] border border-[#eadfd6] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreviewUrl || coverImageUrl}
                    alt="Preview"
                    className="aspect-[0.82] w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="showcase-cover"
            className="mb-2 block text-sm font-medium text-[#6f6156]"
          >
            URL обложки
          </label>
          <Input
            id="showcase-cover"
            value={coverImageUrl}
            onChange={(event) => {
              setCoverImageUrl(event.target.value);
              setCoverPreviewUrl("");
            }}
            placeholder="https://... или /demo/styles/old-money-portrait.png"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="showcase-category"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Категория
        </label>
        <select
          id="showcase-category"
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
            setSubcategoryId("");
          }}
          className="h-12 w-full rounded-2xl border border-[#dfd1c4] bg-white px-4 text-sm text-[#3d3128] outline-none"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="showcase-subcategory"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Подкатегория
        </label>
        <select
          id="showcase-subcategory"
          value={subcategoryId}
          onChange={(event) => setSubcategoryId(event.target.value)}
          className="h-12 w-full rounded-2xl border border-[#dfd1c4] bg-white px-4 text-sm text-[#3d3128] outline-none"
        >
          <option value="">Без подкатегории</option>
          {visibleSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="showcase-sort-order"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Порядок сортировки
        </label>
        <Input
          id="showcase-sort-order"
          type="number"
          inputMode="numeric"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          placeholder="10"
        />
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-[#eadfd6] bg-[#fffaf6] px-4 py-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="size-4 rounded border-[#d9c8bb]"
        />
        <span className="text-sm text-[#5f5248]">Карточка активна</span>
      </label>

      {errorText ? (
        <div className="rounded-2xl border border-[#efc7c1] bg-[#fff5f3] px-4 py-3 text-sm text-[#9e5145]">
          {errorText}
        </div>
      ) : null}

      {successText ? (
        <div className="rounded-2xl border border-[#d7e7cf] bg-[#f4fbef] px-4 py-3 text-sm text-[#5d7a4b]">
          {successText}
        </div>
      ) : null}

      <Button type="submit" size="xl" className="w-full" disabled={isSubmitting || isUploadingCover}>
        {isSubmitting ? "Сохраняем..." : "Создать карточку"}
      </Button>
    </form>
  );
}
