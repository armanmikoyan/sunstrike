import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/ui/button";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { studioCopy, studioModels } from "./constants";
import type { StudioHeaderProps } from "./types";

export function StudioHeader({ mode, credits }: StudioHeaderProps) {
  const isVideo = mode === "video";
  const copy = studioCopy.header;

  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="size-7 rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
        >
          <Link href="/" aria-label={copy.backHome}>
            <ArrowLeft className="size-3.5" />
          </Link>
        </Button>
        <span className="h-4 w-px bg-border" />
        <span className="truncate text-[0.75rem] font-medium">
          {studioModels[mode].label}
        </span>
        <div className="ml-1 hidden items-center gap-0.5 rounded-lg border border-white/[0.07] bg-white/[0.015] p-0.5 sm:flex">
          <Link
            href="/create/video"
            className={cn(
              "flex h-6 items-center gap-1 rounded-md px-2 text-[0.6875rem] font-medium text-muted-foreground",
              isVideo && "bg-white/[0.08] text-foreground",
            )}
          >
            <Film className="size-2.5" />
            {copy.video}
          </Link>
          <Link
            href="/create/image"
            className={cn(
              "flex h-6 items-center gap-1 rounded-md px-2 text-[0.6875rem] font-medium text-muted-foreground",
              !isVideo && "bg-white/[0.08] text-foreground",
            )}
          >
            <ImageIcon className="size-2.5" />
            {copy.image}
          </Link>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <span className="hidden rounded-md border border-white/[0.07] px-2 py-1 text-[0.6875rem] text-muted-foreground md:block">
          {formatUSD(credits)}
        </span>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-7 rounded-md border-white/[0.09] bg-white/[0.025] px-2.5 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
        >
          <Link href="/library">
            {copy.library}
            <ArrowUpRight className="size-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
