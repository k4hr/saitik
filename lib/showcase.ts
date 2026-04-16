export const SHOWCASE_KIND = {
  READY: "READY",
  CUSTOM: "CUSTOM",
} as const;

export type ShowcaseKindValue =
  (typeof SHOWCASE_KIND)[keyof typeof SHOWCASE_KIND];
