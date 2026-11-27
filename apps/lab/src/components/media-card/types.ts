export type MediaKind = "video" | "image";
export type MediaFilter = "all" | MediaKind;
export type MediaSearchField = "title" | "prompt" | "model";
export type MediaCategory = "Portrait" | "Fashion" | "Abstract" | "City" | "Nature" | "Space" | "Cinematic";

export type MediaItem = {
  id: string;
  title: string;
  prompt: string;
  kind: MediaKind;
  category: MediaCategory;
  src: string;
  /** Full-resolution source for large surfaces; `src` is the lighter preview. */
  fullSrc?: string;
  poster: string;
  aspect: string;
  model: string;
  cost: number;
  duration?: string;
  createdAt: string;
  fallback: string;
};

export type MediaCardProps = {
  item: MediaItem;
  className?: string;
  aspect?: string;
  priority?: boolean;
  showMeta?: boolean;
};

export type MediaCardItemProps = {
  item: MediaItem;
};

export type MediaCardMediaProps = MediaCardItemProps & {
  priority: boolean;
};

export type MediaCardOverlayProps = MediaCardItemProps & {
  showMeta: boolean;
};
