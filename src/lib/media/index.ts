export type MediaKind = "video" | "image";
export type MediaCategory =
  | "Portrait"
  | "Fashion"
  | "Abstract"
  | "City"
  | "Nature"
  | "Space"
  | "Cinematic";

export type MediaItem = {
  id: string;
  title: string;
  prompt: string;
  kind: MediaKind;
  category: MediaCategory;
  src: string;
  poster: string;
  aspect: string;
  model: string;
  cost: number;
  duration?: string;
  createdAt: string;
  fallback: string;
};
