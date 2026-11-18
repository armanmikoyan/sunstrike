import Image from "next/image";
import { MediaKindBadge } from "@/ui/media-kind-badge";
import { VideoWithFallback } from "@/components/video-with-fallback";
import type { MediaCardMediaProps } from "./types";

/** The still or clip itself, with the shared grade and kind badge. */
export function MediaCardMedia({ item, priority }: MediaCardMediaProps) {
  return (
    <>
      {item.kind === "video" ? (
        <VideoWithFallback
          src={item.src}
          poster={item.poster}
          fallback={item.fallback}
          preload={priority ? "auto" : "metadata"}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <Image
          src={item.poster}
          alt={item.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-opacity duration-300"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/0 to-black/15 opacity-80" />

      <div className="absolute left-2.5 top-2.5">
        <MediaKindBadge kind={item.kind} time={item.kind === "video" ? item.duration : undefined} />
      </div>
    </>
  );
}
