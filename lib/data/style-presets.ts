export type StyleOption = {
  id: string;
  title: string;
  category: string;
  description: string;
  promptTemplate?: string | null;
  coverImageUrl?: string | null;
};

export const styleCategories = [
  "Все стили",
  "Pinterest",
  "Luxury",
  "Business",
  "Dating",
  "Travel",
  "Editorial",
] as const;

export const stylePresets: StyleOption[] = [
  {
    id: "old-money-portrait",
    title: "Old Money Portrait",
    category: "Luxury",
    description: "Тихая роскошь, мягкий свет и дорогой спокойный образ.",
    promptTemplate:
      "Luxury old money portrait, elegant styling, premium natural skin, soft expensive light, refined composition, calm quiet luxury mood.",
  },
  {
    id: "pinterest-soft",
    title: "Pinterest Soft",
    category: "Pinterest",
    description: "Нежные оттенки, воздушная эстетика и премиальный мягкий вайб.",
    promptTemplate:
      "Soft pinterest aesthetic, airy feminine styling, gentle tones, creamy color palette, polished premium composition.",
  },
  {
    id: "business-clean",
    title: "Business Clean",
    category: "Business",
    description: "Чистые деловые кадры для сайта, LinkedIn и личного бренда.",
    promptTemplate:
      "Clean business portrait, premium corporate aesthetic, polished wardrobe, professional posture, refined office/editorial lighting.",
  },
];
