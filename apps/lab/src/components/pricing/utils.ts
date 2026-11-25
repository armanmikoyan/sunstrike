import type { ModelOption } from "@/components/studio/types";
import type { GenerationKind, ModelRow } from "./types";

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

/** Whole example outputs the amount buys: clips of the example length for video, single images for stills. */
export function modelCapacity(model: ModelOption | undefined, amount: number) {
  const price = model?.example.total ?? 0;

  return price > 0 ? Math.floor(amount / price) : 0;
}

/** Video and image rows alternate, so the "All models" view mixes both kinds from the top. */
export function interleaveRows(videoModels: readonly ModelOption[], imageModels: readonly ModelOption[]): ModelRow[] {
  const rows: ModelRow[] = [];

  for (let index = 0; index < Math.max(videoModels.length, imageModels.length); index += 1) {
    const video = videoModels[index];
    const image = imageModels[index];

    if (video) rows.push({ kind: "video", model: video });
    if (image) rows.push({ kind: "image", model: image });
  }

  return rows;
}

export function rowsFor(rows: readonly ModelRow[], kind: GenerationKind | "all") {
  return kind === "all" ? [...rows] : rows.filter((row) => row.kind === kind);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}
