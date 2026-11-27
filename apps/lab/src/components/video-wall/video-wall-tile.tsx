import Image from "next/image";
import { MediaKindBadge } from "@/ui/media-kind-badge";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { mediaById } from "@/mocks/media";
import { WALL_TILE_SIZES } from "./constants";
import type { VideoWallTileProps } from "./types";

export function VideoWallTile({ id, live, preload }: VideoWallTileProps) {
  const item = mediaById(id);
  if (!item) return null;

  return (
    <div
      data-wall-tile
      className="group relative aspect-3/4 w-full overflow-hidden rounded-[0.875rem] bg-secondary sm:rounded-[1.125rem]"
      style={{
        backgroundImage: `url(${item.poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {item.kind === "video" ? (
        live ? (
          <VideoWithFallback
            src={item.wallSrc ?? item.src}
            poster={item.poster}
            fallback={item.fallback}
            preload={preload}
            className="absolute inset-0 size-full object-cover"
          />
        ) : null
      ) : (
        <Image src={item.poster} alt="" fill sizes={WALL_TILE_SIZES} className="object-cover" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:p-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-white lg:text-[0.6875rem]">{item.title}</p>
          <p className="mt-0.5 truncate text-xs lg:text-[0.6875rem] text-white/60">{item.model}</p>
        </div>
        <MediaKindBadge
          kind={item.kind}
          time={item.kind === "video" ? item.duration : undefined}
          className="shrink-0"
        />
      </div>
    </div>
  );
}
