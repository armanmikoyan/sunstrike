export const MIN_IMAGES = 1;
export const MAX_IMAGES = 500;

export const MIN_CLIPS = 1;
export const MAX_CLIPS = 50;

/** Default per-clip rate, shown wherever a single video price is needed. */
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

export function getImageUnitPrice(quantity: number) {
  if (quantity >= 50) return 0.05;
  if (quantity >= 10) return 0.06;
  return 0.07;
}

export function clampImageQuantity(quantity: number) {
  return Math.min(MAX_IMAGES, Math.max(MIN_IMAGES, Math.round(quantity)));
}

export function getImageQuote(quantity: number) {
  const count = clampImageQuantity(quantity);
  const unit = getImageUnitPrice(count);
  const total = Math.round(count * unit * 100) / 100;
  const base = count * 0.07;
  const savings = Math.round((base - total) * 100) / 100;
  const percent = base > 0 ? Math.round((savings / base) * 100) : 0;

  return {
    quantity: count,
    unit,
    total,
    savings,
    percent,
  };
}

export function clampClipQuantity(quantity: number) {
  return Math.min(MAX_CLIPS, Math.max(MIN_CLIPS, Math.round(quantity)));
}

export function getVideoQuote(quantity: number, model: VideoModelId) {
  const count = clampClipQuantity(quantity);
  const unit =
    videoModels.find((item) => item.id === model)?.price ?? VIDEO_PRICE;
  const total = Math.round(count * unit * 100) / 100;

  return {
    quantity: count,
    unit,
    total,
  };
}

export function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
