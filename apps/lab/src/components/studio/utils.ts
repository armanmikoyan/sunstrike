import { formatUSDRate } from "@/components/pricing/utils";
import type { GenerationMode, ModelOption, Offering, QuoteRequest } from "./types";
import { ASPECT_RATIOS, DURATION_SPOKEN_UNIT, MICROS_PER_USD, PRICE_UNIT_SUFFIX, QUOTE_KIND } from "./constants";

export function aspectRatiosFor(model: ModelOption) {
  return ASPECT_RATIOS.filter((ratio) => model.capabilities.aspectRatios.includes(ratio.value));
}

export function durationsFor(model: ModelOption) {
  return model.capabilities.durationsSeconds;
}

export function resolutionsFor(model: ModelOption) {
  return model.capabilities.resolutions;
}

export function microsToUSD(micros: number) {
  return micros / MICROS_PER_USD;
}

export function toModelOption({ model, price }: Offering): ModelOption {
  const { tiers, resolutionMultipliers, audioMultiplier } = price.rules;

  return {
    id: model.id,
    slug: model.slug,
    displayName: model.name,
    summary: model.summary,
    vendor: model.vendor,
    capabilities: model.capabilities,
    unit: price.unit,
    unitPrice: microsToUSD(price.unitPriceMicros),
    priceVaries: Object.values(resolutionMultipliers).some((multiplier) => multiplier > 1) || audioMultiplier > 1,
    tiers: tiers.map((tier) => ({ minQuantity: tier.minQuantity, unitPrice: microsToUSD(tier.unitPriceMicros) })),
    example: { units: price.example.units, total: microsToUSD(price.example.totalMicros) },
  };
}

export function modelsForMode(models: readonly ModelOption[], mode: GenerationMode) {
  return models.filter((model) => model.capabilities.modes.includes(mode));
}

export function formatDuration(seconds: number) {
  return `${seconds}s`;
}

export function formatDurationRange(options: readonly number[]) {
  const first = options[0];
  const last = options.at(-1);

  if (first === undefined || last === undefined) return "";

  return first === last ? formatDuration(first) : `${first}–${formatDuration(last)}`;
}

export function spokenDuration(seconds: number) {
  return `${seconds} ${DURATION_SPOKEN_UNIT}`;
}

export function durationIndex(options: readonly number[], seconds: number) {
  return Math.max(0, options.indexOf(seconds));
}

export function formatRate(model: ModelOption) {
  return `${formatUSDRate(model.unitPrice)}${PRICE_UNIT_SUFFIX[model.unit]}`;
}

export function quoteQuery(request: QuoteRequest) {
  const params = new URLSearchParams({
    kind: QUOTE_KIND,
    modelId: request.modelId,
    mode: request.mode,
    resolution: request.resolution,
    aspectRatio: request.aspectRatio,
    audio: String(request.audio),
  });

  if (request.durationSeconds !== null) params.set("durationSeconds", String(request.durationSeconds));

  return params.toString();
}

export function slots(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}
