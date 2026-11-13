import type {
  GenerationMode,
  GenerationModel,
  GenerationModelCapabilities,
} from "@/lib/design";
import { durations, type ModelOption } from "@/lib/generation";

const VIDEO_ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"];
const STILL_ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4"];

const capabilities = (
  overrides: Partial<GenerationModelCapabilities> = {},
): GenerationModelCapabilities => ({
  modes: ["video"],
  inputs: ["image", "video"],
  resolutions: ["720p", "1080p"],
  durations,
  aspectRatios: VIDEO_ASPECTS,
  audio: true,
  ...overrides,
});

export const generationModels: GenerationModel[] = [
  {
    id: "mdl_motion_2",
    slug: "chronolab-motion-2",
    displayName: "Chronolab Motion 2",
    provider: "Chronolab",
    providerModelId: "motion-2",
    capabilities: capabilities(),
    isEnabled: true,
  },
  {
    id: "mdl_motion_turbo",
    slug: "chronolab-motion-turbo",
    displayName: "Chronolab Motion Turbo",
    provider: "Chronolab",
    providerModelId: "motion-turbo",
    capabilities: capabilities({
      resolutions: ["720p", "1080p"],
      durations: ["4s", "5s", "6s"],
      aspectRatios: ["16:9", "9:16", "1:1"],
      audio: false,
    }),
    isEnabled: true,
  },
  {
    id: "mdl_camera",
    slug: "chronolab-camera",
    displayName: "Chronolab Camera",
    provider: "Chronolab",
    providerModelId: "camera",
    capabilities: capabilities({
      resolutions: ["1080p"],
      durations: ["5s", "6s", "8s"],
      aspectRatios: ["16:9", "9:16", "21:9"],
    }),
    isEnabled: true,
  },
  {
    id: "mdl_loop",
    slug: "chronolab-loop",
    displayName: "Chronolab Loop",
    provider: "Chronolab",
    providerModelId: "loop",
    capabilities: capabilities({
      durations: ["4s", "6s", "8s", "12s"],
      aspectRatios: ["16:9", "9:16", "1:1"],
      audio: false,
    }),
    isEnabled: true,
  },
  {
    id: "mdl_image_2",
    slug: "chronolab-image-2",
    displayName: "Chronolab Image 2",
    provider: "Chronolab",
    providerModelId: "image-2",
    capabilities: capabilities({
      modes: ["image"],
      inputs: ["image"],
      resolutions: ["1 MP"],
      durations: [],
      aspectRatios: STILL_ASPECTS,
      audio: false,
    }),
    isEnabled: true,
  },
  {
    id: "mdl_image_pro",
    slug: "chronolab-image-pro",
    displayName: "Chronolab Image Pro",
    provider: "Chronolab",
    providerModelId: "image-pro",
    capabilities: capabilities({
      modes: ["image"],
      inputs: ["image"],
      resolutions: ["2 MP"],
      durations: [],
      aspectRatios: STILL_ASPECTS,
      audio: false,
    }),
    isEnabled: true,
  },
  {
    id: "mdl_image_raw",
    slug: "chronolab-image-raw",
    displayName: "Chronolab Image Raw",
    provider: "Chronolab",
    providerModelId: "image-raw",
    capabilities: capabilities({
      modes: ["image"],
      inputs: ["image"],
      resolutions: ["4 MP"],
      durations: [],
      aspectRatios: STILL_ASPECTS,
      audio: false,
    }),
    isEnabled: true,
  },
  {
    id: "mdl_product",
    slug: "chronolab-product",
    displayName: "Chronolab Product",
    provider: "Chronolab",
    providerModelId: "product",
    capabilities: capabilities({
      modes: ["image"],
      inputs: ["image"],
      resolutions: ["2 MP"],
      durations: [],
      aspectRatios: STILL_ASPECTS,
      audio: false,
    }),
    isEnabled: true,
  },
];

/** Price per model, kept beside the catalogue until `packages/config` exists. */
export const modelCosts: Record<string, number> = {
  "chronolab-motion-2": 0.51,
  "chronolab-motion-turbo": 0.34,
  "chronolab-camera": 0.6,
  "chronolab-loop": 0.43,
  "chronolab-image-2": 0.07,
  "chronolab-image-pro": 0.12,
  "chronolab-image-raw": 0.17,
  "chronolab-product": 0.1,
};

const withCost = (model: GenerationModel): ModelOption => ({
  ...model,
  cost: modelCosts[model.slug] ?? 0,
});

export function modelsForMode(mode: GenerationMode): ModelOption[] {
  return generationModels
    .filter((model) => model.isEnabled && model.capabilities.modes.includes(mode))
    .map(withCost);
}

export const modelOptions: Record<GenerationMode, ModelOption[]> = {
  video: modelsForMode("video"),
  image: modelsForMode("image"),
};
