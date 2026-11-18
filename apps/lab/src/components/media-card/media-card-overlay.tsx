import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { MEDIA_CARD_COPY } from "./constants";
import type { MediaCardOverlayProps } from "./types";

/** Hover actions over the media plus the always-visible title row. */
export function MediaCardOverlay({ item, showMeta }: MediaCardOverlayProps) {
  return (
    <div className="absolute inset-x-0 bottom-0">
      <div className="pointer-events-none p-3 opacity-0 transition-opacity duration-200 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
        <p className="line-clamp-2 text-xs leading-relaxed text-white/75 lg:text-[0.6875rem]">{item.prompt}</p>
        <div className="mt-2.5 flex items-center gap-1.5">
          <Link
            href={`/create/${item.kind}`}
            className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-xs font-medium text-background lg:text-[0.6875rem] transition-colors hover:bg-foreground/90"
          >
            <Play className="size-3 fill-current" />
            {MEDIA_CARD_COPY.remix}
          </Link>
          <Link
            href="/explore"
            className="flex h-8 items-center gap-1.5 rounded-md border border-white/15 bg-black/35 px-2.5 text-xs font-medium text-white/85 lg:text-[0.6875rem] backdrop-blur transition-colors hover:bg-black/55 hover:text-white"
          >
            {MEDIA_CARD_COPY.details}
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>

      {showMeta ? (
        <div className="p-3 pt-0">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white lg:text-xs">{item.title}</p>
              <p className="mt-0.5 truncate text-xs text-white/65 lg:text-[0.6875rem]">{item.model}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
