import { formatUSDRate } from "@/components/pricing/utils";
import type { GenerationMode, ModelOption, Offering, QuoteRequest } from "./types";
import { ASPECT_RATIOS, MICROS_PER_USD, PRICE_UNIT_SUFFIX, QUOTE_KIND } from "./constants";

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
  return {
    id: model.id,
    slug: model.slug,
    displayName: model.name,
    summary: model.summary,
    capabilities: model.capabilities,
    unit: price.unit,
    unitPrice: microsToUSD(price.unitPriceMicros),
  };
}

export function modelsForMode(models: readonly ModelOption[], mode: GenerationMode) {
  return models.filter((model) => model.capabilities.modes.includes(mode));
}

export function formatDuration(seconds: number) {
  return `${seconds}s`;
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
