import type { GenerationMode } from "@/lib/generation";
import { mediaById, type MediaItem } from "@/lib/media";

/** The focus pull / camera moves offered to video renders. */
export const cameraMoves = ["Static", "Dolly in", "Orbit", "Crane", "Handheld"];

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
    draft: "Draft",
    video: "Video",
    image: "Image",
    share: "Share project",
    library: "Library",
  },
  controls: {
    prompt: "Prompt",
    enhance: "Enhance",
    placeholders: {
      video: "Describe the shot, subject and movement...",
      image: "Describe the frame, light and lens...",
    },
    characterLimit: "/1200",
    references: "References",
    library: "Library",
    dropReference: "Drop a frame or reference",
    referenceAlt: "Reference",
    removeReference: "Remove reference",
    clear: "Clear",
    model: "Model",
    aspectRatio: "Aspect ratio",
    duration: "Duration",
    camera: "Camera",
    advanced: "Advanced",
    negativePrompt: "Negative prompt",
    negativePlaceholder: "blur, extra fingers, text...",
    seed: "Seed",
    seedValue: "847291",
    motionStrength: "Motion strength",
    motionStrengthValue: "62",
    loopTake: "Loop take",
    loopTakeDescription: "Matches the first and last frame.",
    estimatedCost: "Estimated cost",
    generate: { video: "Generate video", image: "Generate image" },
    available: "available · pay as you go",
  },
  summary: {
    model: "Model",
    direction: "Direction",
    output: "Output",
    singleFrame: "Single frame",
    resolution: "1080p",
    currentPrompt: "Current prompt",
    promptOptions: "Prompt options",
    promptMenuLabel: "Prompt",
    copyPrompt: "Copy prompt",
    saveToFavorites: "Save to favorites",
    resetToLast: "Reset to last",
  },
  preview: {
    title: "Preview",
    resolution: "1080p",
    downloadPreview: "Download preview",
    moreOptions: "More options",
    take: "Take 03",
    frameRate: "24fps",
    play: "Play preview",
    still: "still",
    imageUnit: "1 MP",
    times: { video: "00:02", image: "00:00" },
    pause: "Pause",
    volume: "Volume",
    trim: "Trim",
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

