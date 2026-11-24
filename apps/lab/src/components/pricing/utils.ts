import type { GenerationKind, ModelRate } from "./types";
import { IMAGE_TIERS, MAX_IMAGES, MIN_IMAGES } from "./constants";

export function getImageTier(quantity: number) {
  let tier = IMAGE_TIERS[0];

  for (const candidate of IMAGE_TIERS) {
    if (quantity >= candidate.start) tier = candidate;
  }

  return tier;
}

export function getImageUnitPrice(quantity: number) {
  return getImageTier(quantity).unit;
}

export function clampImageQuantity(quantity: number) {
  return Math.min(MAX_IMAGES, Math.max(MIN_IMAGES, Math.round(quantity)));
}

export function getImageQuote(quantity: number) {
  const count = clampImageQuantity(quantity);
  const unit = getImageUnitPrice(count);
  const total = Math.round(count * unit * 100) / 100;
  const base = count * IMAGE_TIERS[0].unit;
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

export function getVideoSecondQuote(seconds: number, perSecond: number) {
  const count = Math.max(1, Math.round(seconds));
  const total = Math.round(count * perSecond * 100) / 100;

  return {
    seconds: count,
    perSecond,
    total,
  };
}

export function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatUSDRate(value: number) {
  const fractionDigits = Math.round(value * 1000) % 10 === 0 ? 2 : 3;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function amountLabel(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function modelCapacity(
  model: ModelRate | undefined,
  mode: GenerationKind,
  amount: number,
  videoSeconds: number,
) {
  const rate = model ? (mode === "video" ? (model.perSecond ?? 0) : (model.perImage ?? 0)) : 0;
  if (rate <= 0) return 0;
  return mode === "video" ? Math.floor(amount / (rate * videoSeconds)) : Math.floor(amount / rate);
}

export function durationRange(durations: string[]) {
  if (durations.length === 0) return "";
  return `${durations[0]}–${durations[durations.length - 1]}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}
