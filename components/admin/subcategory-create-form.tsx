"use client";

import { useMemo, useState } from "react";
import { FolderTree } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slugify";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type SubcategoryCreateFormProps = {
  categories: CategoryOption[];
  suggestedSortOrder: number;
};

export default function SubcategoryCreateForm({
  categories,
  suggestedSortOrder,
}: SubcategoryCreateFormProps) {
  const router = useRouter();

  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(String(suggestedSortOrder));
  const [isActive, setIsActive] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const previewSlug = useMemo(() => {
    return slugTouched ? slugify(slug) : slugify(name);
  }, [name, slug, slugTouched]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorText("");
    setSuccessText("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          name,
          slug: slugTouched ? slug : name,
          sortOrder,
          isActive,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok) {
        setErrorText(data.error || "Не удалось создать подкатегорию");
        setIsSubmitting(false);
        return;
      }

      setSuccessText("Подкатегория успешно создана");
      setName("");
      setSlug("");
      setSlugTouched(false);
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
          htmlFor="subcategory-category"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Родительская категория
        </label>

        <select
          id="subcategory-category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="h-12 w-full rounded-2xl border border-[#dfd1c4] bg-white px-4 text-sm text-[#3d3128] shadow-[0_2px_10px_rgba(88,62,40,0.03)] outline-none transition focus:border-[#caa789]"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.slug})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label
            htmlFor="subcategory-name"
            className="mb-2 block text-sm font-medium text-[#6f6156]"
          >
            Название подкатегории
          </label>
          <Input
            id="subcategory-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Например: Old Money"
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="subcategory-slug"
            className="mb-2 block text-sm font-medium text-[#6f6156]"
          >
            Slug
          </label>
          <Input
            id="subcategory-slug"
            value={slugTouched ? slug : previewSlug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            placeholder="old-money"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div>
          <label
            htmlFor="subcategory-sort-order"
            className="mb-2 block text-sm font-medium text-[#6f6156]"
          >
            Порядок сортировки
          </label>
          <Input
            id="subcategory-sort-order"
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
            Показывать подкатегорию на сайте
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
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || categories.length === 0}
        >
          <FolderTree className="size-4.5" />
          {isSubmitting ? "Создаём..." : "Добавить подкатегорию"}
        </Button>
      </div>
    </form>
  );
}
