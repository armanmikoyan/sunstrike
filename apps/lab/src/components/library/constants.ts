import { mixMediaByKind } from "@/components/media-card/utils";
import { mediaItems } from "@/mocks/media";
import { formatUSD } from "@/components/pricing/utils";
import { formatSeconds } from "./utils";

/** The library is a working slice of the catalogue for the prototype. */
export const LIBRARY_ITEMS = mixMediaByKind(mediaItems).slice(0, 14);

const VIDEO_SECONDS = LIBRARY_ITEMS.reduce((total, item) => {
  if (!item.duration) return total;
  const [minutes, seconds] = item.duration.split(":").map(Number);
  return total + minutes * 60 + seconds;
}, 0);

const SPENT = LIBRARY_ITEMS.reduce((total, item) => total + item.cost, 0);

export const LIBRARY_STATS = [
  { label: "Generations", value: String(LIBRARY_ITEMS.length) },
  { label: "Video seconds", value: formatSeconds(VIDEO_SECONDS) },
  { label: "Spent", value: formatUSD(SPENT) },
];

export const LIBRARY_COPY = {
  eyebrow: "Your studio",
  title: "Library",
  description: "Every finished generation, with the prompt, model and cost attached.",
  newGeneration: "New generation",
};
