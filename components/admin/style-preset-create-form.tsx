"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";

type StylePresetCreateFormProps = {
  suggestedSortOrder: number;
};

export default function StylePresetCreateForm({
  suggestedSortOrder,
}: StylePresetCreateFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [promptTemplate, setPromptTemplate] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(String(suggestedSortOrder));
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const previewSlug = useMemo(() => {
    return slugTouched ? slugify(slug) : slugify(title);
  }, [title, slug, slugTouched]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorText("");
    setSuccessText("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/style-presets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug: slugTouched ? slug : title,
          category,
          description,
          promptTemplate,
          coverImageUrl: coverImageUrl || null,
          sortOrder,
          isActive,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok) {
        setErrorText(data.error || "Не удалось создать style preset");
        setIsSubmitting(false);
        return;
      }

      setSuccessText("Style preset успешно создан");
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setCategory("");
      setDescription("");
      setPromptTemplate("");
      setCoverImageUrl("");
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
          htmlFor="preset-title"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Название стиля
        </label>
        <Input
          id="preset-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Например: Old Money Men 1"
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="preset-slug"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Slug
        </label>
        <Input
          id="preset-slug"
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
          htmlFor="preset-category"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Категория style preset
        </label>
        <Input
          id="preset-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Например: Luxury"
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="preset-description"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Описание
        </label>
        <Textarea
          id="preset-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Короткое описание готового стиля."
        />
      </div>

      <div>
        <label
          htmlFor="preset-prompt"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          Prompt template
        </label>
        <Textarea
          id="preset-prompt"
          value={promptTemplate}
          onChange={(event) => setPromptTemplate(event.target.value)}
          placeholder="Например: luxury old money portrait, premium styling, elegant soft light, quiet luxury interior..."
          className="min-h-[180px]"
        />
      </div>

      <div>
        <label
          htmlFor="preset-cover"
          className="mb-2 block text-sm font-medium text-[#6f6156]"
        >
          URL обложки
        </label>
        <Input
          id="preset-cover"
          value={coverImageUrl}
          onChange={(event) => setCoverImageUrl(event.target.value)}
          placeholder="/demo/styles/old-money-portrait.png"
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div>
          <label
            htmlFor="preset-sort-order"
            className="mb-2 block text-sm font-medium text-[#6f6156]"
          >
            Порядок сортировки
          </label>
          <Input
            id="preset-sort-order"
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
            Показывать style preset
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
          <Sparkles className="size-4.5" />
          {isSubmitting ? "Создаём..." : "Добавить style preset"}
        </Button>
      </div>
    </form>
  );
}
