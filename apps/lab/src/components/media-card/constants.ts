import type { MediaFilter } from "./types";

export const MEDIA_CARD_COPY = {
  remix: "Remix",
  details: "Details",
};

export const MEDIA_FILTER_OPTIONS: { value: MediaFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
];
