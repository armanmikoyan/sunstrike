import type { GenerationMode } from "@/lib/generation";
import type { MediaItem } from "@/lib/media";
import { mediaById } from "@/mocks/media";

const videoTakeIds = ["09", "07", "14", "16"];
const imageTakeIds = ["05", "10", "17", "18"];

const takesFrom = (ids: string[]): MediaItem[] =>
  ids
    .map((id) => mediaById(id))
    .filter((item): item is MediaItem => Boolean(item));

export const videoTakes = takesFrom(videoTakeIds);
export const imageTakes = takesFrom(imageTakeIds);

export const starterPrompts: Record<GenerationMode, string> = {
  video:
    "A slow dolly through a rain-soaked Tokyo alley at midnight, neon reflections on wet asphalt, shallow depth of field, anamorphic flare, cinematic color grade.",
  image:
    "An editorial portrait in cool blue studio light, direct gaze, subtle film grain, 85mm lens, minimal styling, crisp catchlights.",
};

export const studioModels: Record<GenerationMode, { create: string; label: string }> =
  {
    video: { create: "Chronolab Motion 2", label: "Video Studio" },
    image: { create: "Chronolab Image 2", label: "Image Studio" },
  };

export const studioCopy = {
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
    generate: { video: "Generate video", image: "Generate image" },
    available: "available · pay as you go",
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
    still: "still",
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
    title: "Render queued",
    keepDirecting: "Keep directing",
    openLibrary: "Open library",
    recipe: "Recipe",
    reserved: "reserved.",
  },
};

/**
 * Aspect and width classes are written out in full so Tailwind can see them.
 * The frame animates between them with a CSS transition rather than a JS style.
 *
 * Every ratio is capped by the viewport height so the whole frame plus its info
 * row fits without scrolling. The cap uses a smaller offset below `lg`, where
 * the studio is stacked and the frame scrolls to the top of the page, and a
 * larger offset at `lg`, where the nav, studio header and preview chrome sit
 * above a height-locked panel.
 */
export const studioFrameClasses: Record<string, string> = {
  "16:9":
    "aspect-[16/9] max-w-[min(47.5rem,calc((100dvh_-_9.5rem)_*_1.7778))] lg:max-w-[min(47.5rem,calc((100dvh_-_16rem)_*_1.7778))]",
  "9:16":
    "aspect-[9/16] max-w-[min(22.5rem,calc((100dvh_-_9.5rem)_*_0.5625))] lg:max-w-[min(22.5rem,calc((100dvh_-_16rem)_*_0.5625))]",
  "1:1":
    "aspect-square max-w-[min(47.5rem,calc(100dvh_-_9.5rem))] lg:max-w-[min(47.5rem,calc(100dvh_-_16rem))]",
  "4:3":
    "aspect-[4/3] max-w-[min(47.5rem,calc((100dvh_-_9.5rem)_*_1.3333))] lg:max-w-[min(47.5rem,calc((100dvh_-_16rem)_*_1.3333))]",
  "3:4":
    "aspect-[3/4] max-w-[min(22.5rem,calc((100dvh_-_9.5rem)_*_0.75))] lg:max-w-[min(22.5rem,calc((100dvh_-_16rem)_*_0.75))]",
  "21:9":
    "aspect-[21/9] max-w-[min(61.25rem,calc((100dvh_-_9.5rem)_*_2.3333))] lg:max-w-[min(61.25rem,calc((100dvh_-_16rem)_*_2.3333))]",
};

