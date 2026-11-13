import { mediaItems } from "@/mocks/media";
import { formatUSD } from "@/lib/pricing";

/** The library is a working slice of the catalogue for the prototype. */
export const libraryItems = mediaItems.slice(0, 14);

const videoSeconds = libraryItems.reduce((total, item) => {
  if (!item.duration) return total;
  const [minutes, seconds] = item.duration.split(":").map(Number);
  return total + minutes * 60 + seconds;
}, 0);

const spent = libraryItems.reduce((total, item) => total + item.cost, 0);

const formatSeconds = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

export const libraryStats = [
  { label: "Generations", value: String(libraryItems.length) },
  { label: "Video seconds", value: formatSeconds(videoSeconds) },
  { label: "Spent", value: formatUSD(spent) },
];

export const libraryCopy = {
  eyebrow: "Your studio",
  title: "Library",
  description:
    "Every finished generation, with the prompt, model and cost attached.",
  newGeneration: "New generation",
};
