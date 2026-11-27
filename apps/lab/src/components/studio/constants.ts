import type { GenerationMode, PriceUnit } from "@/components/studio/types";
import { mediaByIds } from "@/mocks/media";

export const ASPECT_RATIOS = [
  { value: "16:9", label: "Landscape", shape: "h-2.25 w-4" },
  { value: "9:16", label: "Portrait", shape: "h-4 w-2.25" },
  { value: "1:1", label: "Square", shape: "size-3" },
  { value: "4:3", label: "Classic", shape: "h-3 w-4" },
  { value: "3:4", label: "Editorial", shape: "h-4 w-3" },
  { value: "21:9", label: "Cinema", shape: "h-1.75 w-4.5" },
];

export const OFFERINGS_URL = "/api/offerings";

/** Warm the catalog once the app is idle, with a fallback for older browsers. */
export const OFFERINGS_IDLE_TIMEOUT_MS = 2000;
export const OFFERINGS_IDLE_FALLBACK_MS = 1200;
export const QUOTE_URL = "/api/pricing/quote";
export const QUOTE_KIND = "create";
export const MICROS_PER_USD = 1_000_000;
export const PRICE_UNIT_SUFFIX: Record<PriceUnit, string> = {
  per_second: "/s",
  per_image: "/image",
};

export const VIDEO_TAKES = mediaByIds(["09", "07", "14", "16"]);
export const IMAGE_TAKES = mediaByIds(["05", "10", "17", "18"]);

export const STARTER_PROMPTS: Record<GenerationMode, string> = {
  video:
    "A slow dolly through a rain-soaked Tokyo alley at midnight, neon reflections on wet asphalt, shallow depth of field, anamorphic flare, cinematic color grade.",
  image:
    "An editorial portrait in cool blue studio light, direct gaze, subtle film grain, 85mm lens, minimal styling, crisp catchlights.",
};

export const SKELETON_BAR = "block rounded-full bg-white/6";
export const SKELETON_SURFACE = "rounded-lg border border-white/7 bg-white/1.5";
export const SKELETON_SLOTS = { aspects: 6, takes: 4, facts: 3 };
export const DURATION_SPOKEN_UNIT = "seconds";
export const ZERO_WIDTH_SPACE = "\u200b";

export const STUDIO_LABELS: Record<GenerationMode, string> = {
  video: "Video Studio",
  image: "Image Studio",
};

export const STUDIO_COPY = {
  header: {
    backHome: "Back home",
    video: "Video",
    image: "Image",
    library: "Library",
  },
  controls: {
    prompt: "Prompt",
    placeholders: {
      video: "Describe the shot, subject and movement...",
      image: "Describe the frame, light and lens...",
    },
    template: "Template",
    noTemplate: "No template",
    references: "References",
    library: "Library",
    dropReference: "Drop a frame or reference",
    referenceAlt: "Reference",
    removeReference: "Remove reference",
    clear: "Clear",
    model: "Model",
    aspectRatio: "Aspect ratio",
    duration: "Duration",
    resolution: "Resolution",
    audio: "Native audio",
    silent: "Silent",
    audioHint: "Use the model's generated soundtrack.",
    estimatedCost: "Estimated cost",
    pricing: "Calculating price",
    generate: { video: "Generate video", image: "Generate image", signIn: "Sign in to generate" },
    available: "available · pay as you go",
  },
  unavailable: {
    title: "Models are unavailable",
    body: "We couldn't load the models right now. Try again in a moment.",
  },
  summary: {
    model: "Model",
    template: "Template",
    noTemplate: "None",
    output: "Output",
    currentPrompt: "Current prompt",
  },
  preview: {
    title: "Preview",
    downloadPreview: "Download preview",
    moreOptions: "More options",
    play: "Play preview",
    image: "image",
    imageUnit: "1 MP",
    times: { video: "00:02", image: "00:00" },
    pause: "Pause",
    volume: "Volume",
    fullscreen: "Fullscreen",
    download: "Download",
  },
  takes: {
    title: "Recent takes",
    viewAll: "View all",
  },
  queue: {
    title: "Generation queued",
    keepDirecting: "Keep directing",
    openLibrary: "Open library",
    recipe: "Recipe",
    reserved: "reserved.",
  },
};

export const STUDIO_FRAME_CLASSES: Record<string, string> = {
  "16:9":
    "aspect-video max-w-[min(47.5rem,calc((100dvh_-_9.5rem)_*_1.7778))] lg:max-w-[min(47.5rem,calc((100dvh_-_16rem)_*_1.7778))]",
  "9:16":
    "aspect-9/16 max-w-[min(22.5rem,calc((100dvh_-_9.5rem)_*_0.5625))] lg:max-w-[min(22.5rem,calc((100dvh_-_16rem)_*_0.5625))]",
  "1:1": "aspect-square max-w-[min(47.5rem,calc(100dvh_-_9.5rem))] lg:max-w-[min(47.5rem,calc(100dvh_-_16rem))]",
  "4:3":
    "aspect-4/3 max-w-[min(47.5rem,calc((100dvh_-_9.5rem)_*_1.3333))] lg:max-w-[min(47.5rem,calc((100dvh_-_16rem)_*_1.3333))]",
  "3:4":
    "aspect-3/4 max-w-[min(22.5rem,calc((100dvh_-_9.5rem)_*_0.75))] lg:max-w-[min(22.5rem,calc((100dvh_-_16rem)_*_0.75))]",
  "21:9":
    "aspect-21/9 max-w-[min(61.25rem,calc((100dvh_-_9.5rem)_*_2.3333))] lg:max-w-[min(61.25rem,calc((100dvh_-_16rem)_*_2.3333))]",
};

export const TEMPLATE_NONE = "none";
