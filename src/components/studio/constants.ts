import type { GenerationMode } from "@/lib/store";
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
