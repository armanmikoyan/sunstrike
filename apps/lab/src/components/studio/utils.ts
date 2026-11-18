import { mediaById } from "@/mocks/media";
import type { MediaItem } from "@/components/media-card/types";
import type { GenerationMode, GenerationModel, ModelOption } from "./types";
import { ASPECT_RATIOS } from "./constants";

/** Only the ratios the selected model advertises. */
export function aspectRatiosFor(model: GenerationModel) {
  return ASPECT_RATIOS.filter((ratio) => model.capabilities.aspectRatios.includes(ratio.value));
}

/** Only the durations the selected model advertises. Empty for stills. */
export function durationsFor(model: GenerationModel) {
  return model.capabilities.durations;
}

export function resolutionsFor(model: GenerationModel) {
  return model.capabilities.resolutions;
}

export function getGenerationCost(mode: GenerationMode, model: ModelOption, duration: string) {
  if (mode === "video") {
    // Longer takes add time-based generation cost on top of the base clip rate.
    const durationExtra = duration === "12s" ? 0.43 : duration === "8s" ? 0.17 : 0;
    return Math.round((model.cost + durationExtra) * 100) / 100;
  }
  return model.cost;
}

export function takesFrom(ids: string[]): MediaItem[] {
  return ids.map((id) => mediaById(id)).filter((item): item is MediaItem => Boolean(item));
}
