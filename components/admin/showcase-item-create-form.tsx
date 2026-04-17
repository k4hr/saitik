"use client";

import { useMemo, useState } from "react";
import { ShowcaseKind } from "@prisma/client";
import { useRouter } from "next/navigation";

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

export default function ShowcaseItemCreateForm({
  kind,
  categories,
  subcategories,
  suggestedSortOrder,
}: ShowcaseItemCreateFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [promptTemplate, setPromptTemplate] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [sortOrder, setSortOrder] = useState(String(suggestedSortOrder));
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const previewSlug = useMemo(() => {
    return slugTouched ? slugify(slug) : slugify(title);
  }, [title, slug, slugTouched]);

  const visibleSubcategories = useMemo(() => {
    return subcategories.filter((item) => item.categoryId === categoryId);
  }, [subcategories, categoryId]);

  const isReady = kind === ShowcaseKind.READY;

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
      setCoverImageUrl("");
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
      ) : null}

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
          onChange={(event) => setCoverImageUrl(event.target.value)}
          placeholder="/demo/styles/old-money-portrait.png"
          autoComplete="off"
        />
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

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
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

        <div className="flex items-end">
          <label className="flex h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[#dfd1c4] bg-white px-4 text-sm text-[#3d3128] shadow-[0_2px_10px_rgba(88,62,40,0.03)]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="size-4 rounded border-[#ccb6a3] accent-[#bc9670]"
            />
            Показывать карточку
          </label>
        </div>
      </div>

      {previewSlug ? (
        <div className="rounded-[18px] border border-[#eadfd6] bg-[#fffaf6] px-4 py-3 text-sm text-[#6f6156]">
          Предварительный slug:{" "}
          <span className="font-medium text-[#3d3128]">{previewSlug}</span>
        </div>
      ) : null}

      {errorText ? (
        <div className="rounded-[18px] border border-[#e7c7bf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4f43]">
          {errorText}
        </div>
      ) : null}

      {successText ? (
        <div className="rounded-[18px] border border-[#d8d7c7] bg-[#fafaf4] px-4 py-3 text-sm text-[#58624c]">
          {successText}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Создаём..." : "Добавить карточку"}
        </Button>
      </div>
    </form>
  );
}
