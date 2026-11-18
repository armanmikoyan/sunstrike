import { cn } from "cn";
import { MediaCardMedia } from "./media-card-media";
import { MediaCardOverlay } from "./media-card-overlay";
import type { MediaCardProps } from "./types";

export function MediaCard({ item, className, aspect, priority = false, showMeta = true }: MediaCardProps) {
  return (
    <article className={cn("group relative overflow-hidden rounded-xl bg-card", className)}>
      <div
        className="relative aspect-3/4 w-full overflow-hidden bg-secondary"
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <MediaCardMedia item={item} priority={priority} />
        <MediaCardOverlay item={item} showMeta={showMeta} />
      </div>
    </article>
  );
}
