export type StyleOption = {
  id: string;
  title: string;
  category: string;
  description: string;
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
  },
  {
    id: "pinterest-soft",
    title: "Pinterest Soft",
    category: "Pinterest",
    description: "Нежные оттенки, воздушная эстетика и премиальный мягкий вайб.",
  },
  {
    id: "business-clean",
    title: "Business Clean",
    category: "Business",
    description: "Чистые деловые кадры для сайта, LinkedIn и личного бренда.",
  },
  {
    id: "dating-premium",
    title: "Dating Premium",
    category: "Dating",
    description: "Живые естественные фото, которые выглядят дорого и цепляют.",
  },
  {
    id: "travel-luxury",
    title: "Travel Luxury",
    category: "Travel",
    description: "Картинка как из отпуска мечты с премиальной подачей.",
  },
  {
    id: "editorial-vogue",
    title: "Editorial Vogue",
    category: "Editorial",
    description: "Журнальная композиция, выразительный портрет и fashion-подача.",
  },
  {
    id: "studio-glow",
    title: "Studio Glow",
    category: "Pinterest",
    description: "Мягкий студийный свет и чистая дорогая картинка.",
  },
  {
    id: "dark-masculine",
    title: "Dark Masculine",
    category: "Luxury",
    description: "Более темный контрастный стиль с дорогим мужским образом.",
  },
  {
    id: "city-business-woman",
    title: "City Business Woman",
    category: "Business",
    description: "Сильная городская эстетика для экспертов и личного бренда.",
  },
];
