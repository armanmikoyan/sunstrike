import { Film, Image as ImageIcon, LayoutGrid, type LucideIcon } from "lucide-react";
import { mediaById } from "@/mocks/media";
import type { Filter } from "./types";

export const ASSET_IDS = ["01", "02", "04", "05", "06", "07", "10", "11", "13", "15", "17", "18"];

export const ASSETS_COPY = {
  eyebrow: "Studio",
  title: "Assets",
  description: "Images, video and audio in your account. Every generation can use them as an input.",
  upload: "Upload",
  dropTitle: "Drop files here or click to upload",
  dropHint: "Images, video or audio · up to 50 MB per file",
  recentTitle: "Recent assets",
  filterLabel: "Filter assets",
  filters: {
    all: "All",
    image: "Images",
    video: "Video",
    audio: "Audio",
  },
  storagePrefix: "assets/",
} as const;

export const ASSETS = ASSET_IDS.map((id) => mediaById(id)).filter((item) => item !== undefined);

export const FILTERS: { value: Filter; label: string; icon: LucideIcon }[] = [
  { value: "all", label: ASSETS_COPY.filters.all, icon: LayoutGrid },
  { value: "video", label: ASSETS_COPY.filters.video, icon: Film },
  { value: "image", label: ASSETS_COPY.filters.image, icon: ImageIcon },
];
