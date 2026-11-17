import type { MediaItem } from "@/lib/media";

export type MediaCardProps = {
  item: MediaItem;
  className?: string;
  aspect?: string;
  priority?: boolean;
  showMeta?: boolean;
};
