import { Coins } from "lucide-react";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { mediaById } from "@/mocks/media";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { ClipStripProps } from "./types";

export function ClipStrip({ ids, className }: ClipStripProps) {
  const clips = ids
    .map((id) => mediaById(id))
    .filter((item) => item !== undefined);

  return (
    <div className={cn("flex gap-2.5", className)}>
      {clips.map((item) => (
        <div
          key={item.id}
          className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-secondary"
        >
          <VideoWithFallback
            src={item.src}
            poster={item.poster}
            fallback={item.fallback}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
          />
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md border border-white/25 bg-black/75 px-2 py-1.5 font-mono text-[0.75rem] font-medium leading-none text-white shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.5)] backdrop-blur-md">
            <Coins className="size-3 text-white/70" aria-hidden />
            {formatUSD(item.cost)}
            <span className="sr-only">
              {" "}
              to generate {item.title}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
