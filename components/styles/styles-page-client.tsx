"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { stylePresets } from "@/lib/data/style-presets";

type TopCategory = "Женские" | "Мужские" | "Семейные";

type StyleCardConfig = {
  presetId: string;
  topCategory: TopCategory;
  subCategory: string;
  image: string;
};

type StylesPageClientProps = {
  isAuthenticated: boolean;
};

const topCategories: TopCategory[] = ["Женские", "Мужские", "Семейные"];

const styleCardConfigs: StyleCardConfig[] = [
  {
    presetId: "old-money-portrait",
    topCategory: "Женские",
    subCategory: "Old Money",
    image: "/demo/styles/old-money-portrait.png",
  },
  {
    presetId: "pinterest-soft",
    topCategory: "Женские",
    subCategory: "Pinterest",
    image: "/demo/styles/pinterest-soft.png",
  },
  {
    presetId: "business-clean",
    topCategory: "Женские",
    subCategory: "Business",
    image: "/demo/styles/business-clean.png",
  },
  {
    presetId: "editorial-vogue",
    topCategory: "Женские",
    subCategory: "Editorial",
    image: "/demo/styles/editorial-vogue.png",
  },
  {
    presetId: "studio-glow",
    topCategory: "Женские",
    subCategory: "Studio",
    image: "/demo/styles/studio-glow.png",
  },
  {
    presetId: "dark-masculine",
    topCategory: "Мужские",
    subCategory: "Old Money",
    image: "/demo/styles/dark-masculine.png",
  },
  {
    presetId: "city-business",
    topCategory: "Мужские",
    subCategory: "Business",
    image: "/demo/styles/city-business-woman.png",
  },
  {
    presetId: "dating-premium",
    topCategory: "Мужские",
    subCategory: "Dating",
    image: "/demo/styles/dating-premium.png",
  },
  {
    presetId: "travel-luxury",
    topCategory: "Мужские",
    subCategory: "Travel",
    image: "/demo/styles/travel-luxury.png",
  },
  {
    presetId: "family-classic",
    topCategory: "Семейные",
    subCategory: "Classic",
    image: "/demo/hero-main-2.png",
  },
  {
    presetId: "family-warm",
    topCategory: "Семейные",
    subCategory: "Warm",
    image: "/demo/hero-main-4.png",
  },
  {
    presetId: "family-premium",
    topCategory: "Семейные",
    subCategory: "Luxury",
    image: "/demo/hero-main-3.png",
  },
];

export default function StylesPageClient({
  isAuthenticated,
}: StylesPageClientProps) {
  const [selectedTopCategory, setSelectedTopCategory] =
    useState<TopCategory>("Женские");
  const [selectedSubCategory, setSelectedSubCategory] = useState("Все");

  const primaryHref = isAuthenticated ? "/create" : "/auth/sign-in";

  const styles = useMemo(() => {
    return styleCardConfigs
      .map((config) => {
        const preset = stylePresets.find((item) => item.id === config.presetId);

        if (!preset) {
          return null;
        }

        return {
          id: preset.id,
          title: preset.title,
          topCategory: config.topCategory,
          subCategory: config.subCategory,
          image: config.image,
        };
      })
      .filter(
        (
          item,
        ): item is {
          id: string;
          title: string;
          topCategory: TopCategory;
          subCategory: string;
          image: string;
        } => item !== null,
      );
  }, []);

  const subCategories = useMemo(() => {
    return Array.from(
      new Set(
        styles
          .filter((item) => item.topCategory === selectedTopCategory)
          .map((item) => item.subCategory),
      ),
    );
  }, [selectedTopCategory, styles]);

  const visibleSubCategories = useMemo(
    () => ["Все", ...subCategories],
    [subCategories],
  );

  const filteredStyles = useMemo(() => {
    return styles.filter((item) => {
      if (item.topCategory !== selectedTopCategory) {
        return false;
      }

      if (
        selectedSubCategory !== "Все" &&
        item.subCategory !== selectedSubCategory
      ) {
        return false;
      }

      return true;
    });
  }, [selectedTopCategory, selectedSubCategory, styles]);

  function handleTopCategoryChange(category: TopCategory) {
    setSelectedTopCategory(category);
    setSelectedSubCategory("Все");
  }

  return (
    <>
      <section className="border-b border-[#eadfd6] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(248,242,237,1)_58%)]">
        <Container className="py-14 sm:py-18 lg:py-20">
          <p className="text-xs uppercase tracking-[0.22em] text-[#a18672]">
            Каталог фотосессий
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.04] text-[#3d3128] sm:text-5xl lg:text-6xl">
            Готовые стили, которые можно выбрать за пару секунд
          </h1>

          <div className="mt-8">
            <Button variant="secondary" size="xl" className="pointer-events-none">
              Фильтры
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-12 lg:py-14">
        <Container>
          <div className="mb-4 flex flex-wrap gap-3">
            {topCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleTopCategoryChange(category)}
                className={`rounded-full px-5 py-2.5 text-sm transition ${
                  selectedTopCategory === category
                    ? "bg-[#b79273] text-white"
                    : "border border-[#d8c5b7] bg-white text-[#5f5248] hover:bg-[#efe4db]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            {visibleSubCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedSubCategory(category)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedSubCategory === category
                    ? "bg-[#b79273] text-white"
                    : "border border-[#d8c5b7] bg-white text-[#5f5248] hover:bg-[#efe4db]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredStyles.map((item) => (
              <Link
                key={item.id}
                href={
                  isAuthenticated
                    ? `/create?style=${encodeURIComponent(item.id)}`
                    : "/auth/sign-in"
                }
                className="group block overflow-hidden rounded-[22px] border border-[#eadfd6] bg-white shadow-[0_8px_24px_rgba(88,62,40,0.05)] transition hover:-translate-y-1"
              >
                <div className="relative aspect-[0.8] overflow-hidden bg-[#eadfd6]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(61,49,40,0.08)_100%)]" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild size="xl">
              <Link href={primaryHref}>
                {isAuthenticated ? "Начать" : "Войти / Регистрация"}
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
