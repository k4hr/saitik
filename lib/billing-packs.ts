export type BillingPackKey = "start" | "creator" | "studio" | "business";

export type BillingPack = {
  key: BillingPackKey;
  name: string;
  subtitle: string;
  priceRub: number;
  credits: number;
  images: number;
  featured: boolean;
  badge?: string;
};

export const BILLING_PACKS: BillingPack[] = [
  {
    key: "start",
    name: "Старт",
    subtitle: "Для первого знакомства",
    priceRub: 290,
    credits: 60,
    images: 6,
    featured: false,
  },
  {
    key: "creator",
    name: "Креатор",
    subtitle: "Для регулярных генераций",
    priceRub: 690,
    credits: 160,
    images: 16,
    featured: false,
  },
  {
    key: "studio",
    name: "Студия",
    subtitle: "Оптимальный выбор",
    priceRub: 1490,
    credits: 380,
    images: 38,
    featured: true,
    badge: "Лучший выбор",
  },
  {
    key: "business",
    name: "Бизнес",
    subtitle: "Максимум выгоды",
    priceRub: 2990,
    credits: 800,
    images: 80,
    featured: false,
  },
];

export const STUDIO_PROMO_PRICE_RUB = 890;
export const BUSINESS_PROMO_PRICE_RUB = 2490;

export function getBillingPack(packKey: BillingPackKey): BillingPack | null {
  return BILLING_PACKS.find((item) => item.key === packKey) ?? null;
}
