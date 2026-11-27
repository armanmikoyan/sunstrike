import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/ui/button";
import { formatUSD } from "@/components/pricing/utils";
import { cn } from "cn";
import { STUDIO_COPY, STUDIO_LABELS } from "./constants";
import type { StudioHeaderProps } from "./types";

export function StudioHeader({ mode, credits }: StudioHeaderProps) {
  const isVideo = mode === "video";

  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="size-7 rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <Link href="/" aria-label={STUDIO_COPY.header.backHome}>
            <ArrowLeft className="size-3.5" />
          </Link>
        </Button>
        <span className="h-4 w-px bg-border" />
        <span className="w-19 truncate text-xs lg:text-[0.6875rem] font-medium">{STUDIO_LABELS[mode]}</span>
        <div className="ml-1 hidden items-center gap-0.5 rounded-lg border border-white/6 bg-white/2.5 p-0.5 sm:flex">
          <Link
            href="/create/video"
            className={cn(
              "flex h-6 items-center rounded-[0.625rem] px-2.5 text-xs lg:text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:bg-white/6 focus-visible:outline-none",
              isVideo && "bg-white/8 text-foreground",
            )}
          >
            {STUDIO_COPY.header.video}
          </Link>
          <Link
            href="/create/image"
            className={cn(
              "flex h-6 items-center rounded-[0.625rem] px-2.5 text-xs lg:text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:bg-white/6 focus-visible:outline-none",
              !isVideo && "bg-white/8 text-foreground",
            )}
          >
            {STUDIO_COPY.header.image}
          </Link>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <span className="hidden rounded-md border border-white/7 px-2 py-1 text-xs lg:text-[0.6875rem] text-muted-foreground md:block">
          <span className="tabular-nums font-normal">{formatUSD(credits)}</span>
        </span>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-7 rounded-md border-white/9 bg-white/2.5 px-2.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <Link href="/library">
            {STUDIO_COPY.header.library}
            <ArrowUpRight className="size-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
