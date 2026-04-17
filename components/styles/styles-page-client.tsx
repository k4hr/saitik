"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SHOWCASE_KIND, type ShowcaseKindValue } from "@/lib/showcase";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
};

type SubcategoryItem = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
};

type ShowcaseItem = {
  id: string;
  title: string;
  slug: string;
  kind: ShowcaseKindValue;
  description: string | null;
  coverImageUrl: string;
  categoryId: string;
  subcategoryId: string | null;
};

type StylesPageClientProps = {
  isAuthenticated: boolean;
  categories: CategoryItem[];
  subcategories: SubcategoryItem[];
  showcaseItems: ShowcaseItem[];
};

type KindTab = "READY" | "CUSTOM";

export default function StylesPageClient({
  isAuthenticated,
  categories,
  subcategories,
  showcaseItems,
}: StylesPageClientProps) {
  const [selectedKind, setSelectedKind] = useState<KindTab>("READY");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const primaryHref = isAuthenticated ? "/create" : "/auth/sign-in";

  const availableCategories = useMemo(() => {
    const currentKind =
      selectedKind === "READY" ? SHOWCASE_KIND.READY : SHOWCASE_KIND.CUSTOM;

    const usedCategoryIds = new Set(
      showcaseItems
        .filter((item) => item.kind === currentKind)
        .map((item) => item.categoryId),
    );

    return categories.filter((category) => usedCategoryIds.has(category.id));
  }, [categories, showcaseItems, selectedKind]);

  useEffect(() => {
    if (
      selectedCategoryId !== "all" &&
      !availableCategories.some((item) => item.id === selectedCategoryId)
    ) {
      setSelectedCategoryId("all");
      setSelectedSubcategoryId("all");
    }
  }, [availableCategories, selectedCategoryId]);

  const visibleSubcategories = useMemo(() => {
    const currentKind =
      selectedKind === "READY" ? SHOWCASE_KIND.READY : SHOWCASE_KIND.CUSTOM;

    const filteredItems = showcaseItems.filter((item) => {
      if (item.kind !== currentKind) {
        return false;
      }

      if (selectedCategoryId !== "all" && item.categoryId !== selectedCategoryId) {
        return false;
      }

      return Boolean(item.subcategoryId);
    });

    const usedSubcategoryIds = new Set(
      filteredItems
        .map((item) => item.subcategoryId)
        .filter((value): value is string => Boolean(value)),
    );

    return subcategories.filter((subcategory) => {
      if (selectedCategoryId !== "all" && subcategory.categoryId !== selectedCategoryId) {
        return false;
      }

      return usedSubcategoryIds.has(subcategory.id);
    });
  }, [showcaseItems, subcategories, selectedKind, selectedCategoryId]);

  useEffect(() => {
    if (
      selectedSubcategoryId !== "all" &&
      !visibleSubcategories.some((item) => item.id === selectedSubcategoryId)
    ) {
      setSelectedSubcategoryId("all");
    }
  }, [visibleSubcategories, selectedSubcategoryId]);

  const filteredItems = useMemo(() => {
    const currentKind =
      selectedKind === "READY" ? SHOWCASE_KIND.READY : SHOWCASE_KIND.CUSTOM;

    return showcaseItems.filter((item) => {
      if (item.kind !== currentKind) {
        return false;
      }

      if (selectedCategoryId !== "all" && item.categoryId !== selectedCategoryId) {
        return false;
      }

      if (
        selectedSubcategoryId !== "all" &&
        item.subcategoryId !== selectedSubcategoryId
      ) {
        return false;
      }

      return true;
    });
  }, [showcaseItems, selectedKind, selectedCategoryId, selectedSubcategoryId]);

  function getItemHref(item: ShowcaseItem): string {
    if (!isAuthenticated) {
      return "/auth/sign-in";
    }

    if (item.kind === SHOWCASE_KIND.READY) {
      return `/create?style=${encodeURIComponent(item.id)}`;
    }

    return `/create?showcase=${encodeURIComponent(item.id)}`;
  }

  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(248,242,237,1)_58%)] py-12 sm:py-14 lg:py-18">
      <Container>
        <div className="mx-auto max-w-7xl rounded-[34px] border border-white/60 bg-white/45 p-6 shadow-[0_24px_80px_rgba(91,67,49,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Каталог фотосессий
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.04] text-[#3d3128] sm:text-5xl lg:text-6xl">
            Выберите стиль будущей фотосессии
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#726458] sm:text-lg">
            Сначала выбери тип витрины, затем при необходимости открой фильтры
            по категориям и подкатегориям.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              size="xl"
              onClick={() => setSelectedKind("READY")}
              className={
                selectedKind === "READY"
                  ? "rounded-[22px] bg-[#bc9670] text-[#2f241d]"
                  : "rounded-[22px]"
              }
              variant={selectedKind === "READY" ? "default" : "secondary"}
            >
              Готовые
            </Button>

            <Button
              type="button"
              size="xl"
              onClick={() => setSelectedKind("CUSTOM")}
              className={
                selectedKind === "CUSTOM"
                  ? "rounded-[22px] bg-[#bc9670] text-[#2f241d]"
                  : "rounded-[22px]"
              }
              variant={selectedKind === "CUSTOM" ? "default" : "secondary"}
            >
              Пользовательские
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="xl"
              className="rounded-[22px]"
              onClick={() => setFiltersOpen((prev) => !prev)}
            >
              Фильтры
              <ChevronDown
                className={`size-4.5 transition-transform duration-300 ${
                  filtersOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {filtersOpen ? (
            <div className="mt-6 rounded-[28px] border border-[#eadfd6] bg-white/80 p-5 shadow-[0_12px_34px_rgba(95,69,48,0.06)]">
              <div>
                <p className="text-sm font-medium text-[#6f6156]">Категории</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId("all");
                      setSelectedSubcategoryId("all");
                    }}
                    className={`rounded-full px-5 py-2.5 text-sm transition ${
                      selectedCategoryId === "all"
                        ? "bg-[#b79273] text-white"
                        : "border border-[#d8c5b7] bg-white text-[#5f5248] hover:bg-[#efe4db]"
                    }`}
                  >
                    Все
                  </button>

                  {availableCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setSelectedSubcategoryId("all");
                      }}
                      className={`rounded-full px-5 py-2.5 text-sm transition ${
                        selectedCategoryId === category.id
                          ? "bg-[#b79273] text-white"
                          : "border border-[#d8c5b7] bg-white text-[#5f5248] hover:bg-[#efe4db]"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-[#6f6156]">Стили</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategoryId("all")}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      selectedSubcategoryId === "all"
                        ? "bg-[#b79273] text-white"
                        : "border border-[#d8c5b7] bg-white text-[#5f5248] hover:bg-[#efe4db]"
                    }`}
                  >
                    Все
                  </button>

                  {visibleSubcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      type="button"
                      onClick={() => setSelectedSubcategoryId(subcategory.id)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        selectedSubcategoryId === subcategory.id
                          ? "bg-[#b79273] text-white"
                          : "border border-[#d8c5b7] bg-white text-[#5f5248] hover:bg-[#efe4db]"
                      }`}
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-10">
            {filteredItems.length === 0 ? (
              <div className="rounded-[28px] border border-[#eadfd6] bg-white/70 px-6 py-10 text-center shadow-[0_12px_34px_rgba(95,69,48,0.06)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f2e4d8] text-[#a07f66]">
                  <Sparkles className="size-6" />
                </div>
                <h3 className="mt-4 text-2xl text-[#3d3128]">
                  Пока здесь пусто
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#7e6f63]">
                  В этой комбинации фильтров пока нет карточек. Попробуй
                  переключить тип витрины или выбрать другую категорию.
                </p>
                <div className="mt-6">
                  <Button asChild size="xl">
                    <Link href={primaryHref}>Начать</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[30px] border border-[#eadfd6] bg-white/85 shadow-[0_14px_38px_rgba(88,62,40,0.08)] transition-transform duration-500 hover:-translate-y-1"
                  >
                    <Link href={getItemHref(item)} className="block">
                      <div className="relative aspect-[0.82] overflow-hidden">
                        <Image
                          src={item.coverImageUrl}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(61,49,40,0.14)_100%)]" />
                      </div>

                      <div className="p-5">
                        <h3 className="text-2xl leading-tight text-[#3d3128]">
                          {item.title}
                        </h3>

                        <p className="mt-3 min-h-[56px] text-sm leading-7 text-[#6f6156]">
                          {item.description || "Открыть и перейти к генерации."}
                        </p>

                        <div className="mt-5">
                          <span className="inline-flex rounded-full border border-[#d8c5b7] bg-[#fffaf6] px-4 py-2 text-sm text-[#5f5248]">
                            Начать
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
