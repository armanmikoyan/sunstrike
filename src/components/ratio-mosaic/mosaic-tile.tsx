import Image from "next/image";
import Link from "next/link";
import { Film, ImageIcon } from "lucide-react";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { mediaById } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { MosaicTileProps } from "./types";

export function MosaicTile({ id, label, span }: MosaicTileProps) {
  const item = mediaById(id);
  if (!item) return null;

  return (
    <Link
      href={`/create/${item.kind}`}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card transition-opacity hover:opacity-95",
        span,
      )}
    >
      {item.kind === "video" ? (
        <VideoWithFallback
          src={item.src}
          poster={item.poster}
          fallback={item.fallback}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <Image
          src={item.poster}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/20" />

      <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md border border-white/15 bg-black/45 px-2 py-1 text-[0.6875rem] text-white/85 backdrop-blur-md">
        {item.kind === "video" ? (
          <Film className="size-3" />
        ) : (
          <ImageIcon className="size-3" />
        )}
        {item.kind === "video" ? "Video" : "Image"}
      </span>

      <span className="absolute right-2.5 top-2.5 rounded-md border border-white/15 bg-black/45 px-2 py-1 font-mono text-[0.6875rem] text-white/80 backdrop-blur-md">
        {label}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="truncate text-[0.75rem] font-medium text-white">
          {item.title}
        </p>
        <p className="mt-0.5 truncate text-[0.6875rem] text-white/60">
          {item.model}
        </p>
      </div>
    </Link>
  );
}
