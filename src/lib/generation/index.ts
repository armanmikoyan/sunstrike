import type {
  GenerationMode,
  GenerationModel,
} from "@/lib/design";

export type { GenerationMode } from "@/lib/design";

/**
 * A model row plus the price the UI quotes. `cost` is not a column in the
 * `generation_models` table; it comes from the pricing source, and the whole
 * option list is supplied by `src/mocks` until `GET /api/v1/models` is wired.
 */
export type ModelOption = GenerationModel & { cost: number };

/** UI descriptors for the ratios a model may advertise. */
export const aspectRatios = [
  { value: "16:9", label: "Landscape", shape: "h-[0.5625rem] w-4" },
  { value: "9:16", label: "Portrait", shape: "h-4 w-[0.5625rem]" },
  { value: "1:1", label: "Square", shape: "size-3" },
  { value: "4:3", label: "Classic", shape: "h-3 w-4" },
  { value: "3:4", label: "Editorial", shape: "h-4 w-3" },
  { value: "21:9", label: "Cinema", shape: "h-[0.4375rem] w-[1.125rem]" },
];

/** Fallback duration list; the selected model's capabilities win. */
export const durations = ["4s", "5s", "6s", "8s", "12s"];

/** Only the ratios the selected model advertises. */
export function aspectRatiosFor(model: GenerationModel) {
  return aspectRatios.filter((ratio) =>
    model.capabilities.aspectRatios.includes(ratio.value),
  );
}

/** Only the durations the selected model advertises. Empty for stills. */
export function durationsFor(model: GenerationModel) {
  return model.capabilities.durations;
}

export function resolutionsFor(model: GenerationModel) {
  return model.capabilities.resolutions;
}

export function getGenerationCost(
  mode: GenerationMode,
  model: ModelOption,
  duration: string,
) {
  if (mode === "video") {
    // Longer takes add time-based render cost on top of the base clip rate.
    const durationExtra =
      duration === "12s" ? 0.43 : duration === "8s" ? 0.17 : 0;
    return Math.round((model.cost + durationExtra) * 100) / 100;
  }
  return model.cost;
}
