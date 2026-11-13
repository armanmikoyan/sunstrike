export const VIDEO_PRICE = 0.51;

export const videoModels = [
  {
    id: "turbo",
    name: "Motion Turbo",
    detail: "4s · fast draft",
    price: 0.34,
  },
  {
    id: "standard",
    name: "Motion 2",
    detail: "6s · native audio",
    price: 0.51,
  },
] as const;

export type VideoModelId = (typeof videoModels)[number]["id"];

export function getVideoUnitPrice(model: VideoModelId | string) {
  return videoModels.find((item) => item.id === model)?.price ?? VIDEO_PRICE;
}

export const topUpPacks = [
  {
    id: "starter",
    name: "Starter",
    price: 10,
    note: "For a quick round of tests",
    popular: false,
  },
  {
    id: "studio",
    name: "Studio",
    price: 25,
    note: "For weekly client work",
    popular: true,
  },
  {
    id: "production",
    name: "Production",
    price: 50,
    note: "For daily shipping",
    popular: false,
  },
];

export const generationRates = [
  {
    name: "Motion turbo",
    detail: "Chronolab Motion Turbo · 4 seconds",
    price: "$0.34",
  },
  {
    name: "Motion standard",
    detail: "Chronolab Motion 2 · 6 seconds",
    price: "$0.51",
  },
  {
    name: "Still image",
    detail: "Chronolab Image 2 · 1 megapixel",
    price: "$0.07",
  },
  {
    name: "Still image pro",
    detail: "Chronolab Image Pro · 2 megapixels",
    price: "$0.12",
  },
];
