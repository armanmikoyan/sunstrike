import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Film,
  Image as ImageIcon,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { studioModels } from "./constants";
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
          className="size-7 rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
        >
          <Link href="/" aria-label="Back home">
            <ArrowLeft className="size-3.5" />
          </Link>
        </Button>
        <span className="h-4 w-px bg-border" />
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[0.75rem] font-medium">
            {studioModels[mode].label}
          </span>
          <span className="hidden rounded border border-white/[0.08] bg-white/[0.025] px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground sm:inline">
            Draft
          </span>
        </div>
        <div className="ml-1 hidden items-center gap-0.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-0.5 sm:flex">
          <Link
            href="/create/video"
            className={cn(
              "flex h-6 items-center gap-1 rounded-md px-2 text-[0.6875rem] font-medium text-muted-foreground",
              isVideo && "bg-white/[0.08] text-foreground",
            )}
          >
            <Film className="size-2.5" />
            Video
          </Link>
          <Link
            href="/create/image"
            className={cn(
              "flex h-6 items-center gap-1 rounded-md px-2 text-[0.6875rem] font-medium text-muted-foreground",
              !isVideo && "bg-white/[0.08] text-foreground",
            )}
          >
            <ImageIcon className="size-2.5" />
            Image
          </Link>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <span className="hidden rounded-md border border-white/[0.07] px-2 py-1 text-[0.6875rem] text-muted-foreground md:block">
          {formatUSD(credits)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          aria-label="Share project"
        >
          <Share2 className="size-3.5" />
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-7 rounded-md border-white/[0.09] bg-white/[0.025] px-2.5 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
        >
          <Link href="/library">
            Library
            <ArrowUpRight className="size-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
