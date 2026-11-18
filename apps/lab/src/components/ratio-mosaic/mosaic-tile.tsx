import Image from "next/image";
import Link from "next/link";
import { Coins } from "lucide-react";
import { MediaKindBadge } from "@/ui/media-kind-badge";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { mediaById } from "@/mocks/media";
import { formatUSD } from "@/components/pricing/utils";
import { cn } from "cn";
import type { MosaicTileProps } from "./types";

export function MosaicTile({ id, label, span, showCost = false }: MosaicTileProps) {
  const item = mediaById(id);
  if (!item) return null;

  return (
    <Link href={`/create/${item.kind}`} className={cn("group relative overflow-hidden rounded-xl bg-card", span)}>
      {item.kind === "video" ? (
        <VideoWithFallback
          src={item.src}
          poster={item.poster}
          fallback={item.fallback}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <Image src={item.poster} alt={item.title} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/20 transition-opacity duration-300 group-hover:opacity-0" />

      <MediaKindBadge
        kind={item.kind}
        className="absolute left-2.5 top-2.5 transition-opacity duration-200 group-hover:opacity-0"
      />

      <span className="absolute right-2.5 top-2.5 rounded-md border border-white/15 bg-black/45 px-2 py-1 font-mono text-xs lg:text-[0.6875rem] text-white/80 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-0">
        {label}
      </span>

      {showCost ? (
        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-md border border-white/25 bg-black/75 px-2.5 py-2 text-sm lg:text-xs font-normal leading-none text-white shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.5)] backdrop-blur-md transition-opacity duration-200 group-hover:opacity-0">
          <Coins className="size-3.5 text-white/70" aria-hidden />
          <span className="tabular-nums font-normal">{formatUSD(item.cost)}</span>
          <span className="sr-only"> to generate {item.title}</span>
        </span>
      ) : null}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-3 transition-opacity duration-200 group-hover:opacity-0",
          showCost && "pr-16",
        )}
      >
        <p className="truncate text-xs lg:text-[0.6875rem] font-medium text-white">{item.title}</p>
        <p className="mt-0.5 truncate text-xs lg:text-[0.6875rem] text-white/60">{item.model}</p>
      </div>
    </Link>
  );
}
