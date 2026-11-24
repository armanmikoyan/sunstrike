import type { GenerationMode, GenerationModel, ModelOption } from "./types";
import { ASPECT_RATIOS } from "./constants";

export function aspectRatiosFor(model: GenerationModel) {
  return ASPECT_RATIOS.filter((ratio) => model.capabilities.aspectRatios.includes(ratio.value));
}

export function durationsFor(model: GenerationModel) {
  return model.capabilities.durations;
}

export function resolutionsFor(model: GenerationModel) {
  return model.capabilities.resolutions;
}

export function getGenerationCost(mode: GenerationMode, model: ModelOption, duration: string) {
  if (mode === "video") {
    const durationExtra = duration === "12s" ? 0.43 : duration === "8s" ? 0.17 : 0;
    return Math.round((model.cost + durationExtra) * 100) / 100;
  }
  return model.cost;
}
