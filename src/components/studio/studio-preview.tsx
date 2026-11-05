"use client";

import Image from "next/image";
import {
  Clock3,
  Download,
  Film,
  Heart,
  Image as ImageIcon,
  Maximize,
  MoreHorizontal,
  Pause,
  Play,
  Scissors,
  Volume2,
} from "lucide-react";
import { Button } from "@/ui/button";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { studioCopy } from "./constants";
import type { StudioPreviewProps } from "./types";

export function StudioPreview({ studio, children }: StudioPreviewProps) {
  const copy = studioCopy.preview;
  const {
    active,
    aspect,
    duration,
    cost,
    isVideo,
    vertical,
    cinema,
    cssAspect,
    selectedModel,
  } = studio;

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#131517]">
      <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="text-[0.6875rem] font-medium">{copy.title}</span>
          <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
            {aspect}
          </span>
          <span className="hidden items-center gap-1 text-[0.6875rem] text-muted-foreground sm:flex">
            <Clock3 className="size-2.5" />
            {active.createdAt}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground sm:inline">
            {copy.resolution}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
            aria-label={copy.downloadPreview}
          >
            <Download className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
            aria-label={copy.moreOptions}
          >
            <MoreHorizontal className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-[61.25rem]">
          <div
            className={cn(
              "relative mx-auto w-full overflow-hidden rounded-xl border border-white/[0.1] bg-secondary shadow-[0_1.875rem_6.25rem_-2.5rem_rgba(0,0,0,0.9)]",
              vertical && "max-w-[22.5rem]",
              !vertical && !cinema && "max-w-[47.5rem]",
            )}
            style={{ aspectRatio: cssAspect }}
          >
            {isVideo && active.kind === "video" ? (
              <video
                key={active.id}
                src={active.src}
                poster={active.poster}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <Image
                src={active.poster}
                alt={active.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

            <div className="absolute left-3 top-3 flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-md border border-white/15 bg-black/40 px-1.5 py-1 text-[0.6875rem] text-white/80 backdrop-blur-md">
                {isVideo ? (
                  <Film className="size-2.5" />
                ) : (
                  <ImageIcon className="size-2.5" />
                )}
                {selectedModel.name}
              </span>
              <span className="rounded-md border border-white/15 bg-black/40 px-1.5 py-1 font-mono text-[0.6875rem] text-white/65 backdrop-blur-md">
                {copy.take}
              </span>
            </div>

            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <span className="rounded-md border border-white/15 bg-black/40 px-1.5 py-1 font-mono text-[0.6875rem] text-white/65 backdrop-blur-md">
                {duration} · {copy.frameRate}
              </span>
            </div>

            <button
              type="button"
              aria-label={copy.play}
              className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white/90 backdrop-blur-md transition-colors hover:bg-black/55"
            >
              {isVideo ? (
                <Play className="ml-0.5 size-4 fill-current" />
              ) : (
                <Maximize className="size-4" />
              )}
            </button>

            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <div className="mb-2.5 flex items-center gap-1.5">
                <span className="rounded border border-white/15 bg-black/30 px-1.5 py-0.5 font-mono text-[0.6875rem] text-white/70">
                  {isVideo ? copy.times.video : copy.times.image}
                </span>
                <div className="relative h-[0.1875rem] flex-1 overflow-hidden rounded-full bg-white/20">
                  <span className="absolute inset-y-0 left-0 w-[38%] rounded-full bg-foreground/80" />
                  <span className="absolute left-[38%] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
                </div>
                <span className="font-mono text-[0.6875rem] text-white/60">
                  {isVideo ? duration : copy.still}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {isVideo ? (
                    <button
                      type="button"
                      className="grid size-7 place-items-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
                      aria-label={copy.pause}
                    >
                      <Pause className="size-3 fill-current" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                    aria-label={copy.volume}
                  >
                    <Volume2 className="size-3" />
                  </button>
                  <button
                    type="button"
                    className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                    aria-label={copy.trim}
                  >
                    <Scissors className="size-3" />
                  </button>
                  <span className="ml-1 max-w-[13.75rem] truncate text-[0.6875rem] text-white/55">
                    {active.title}
                  </span>
                </div>
                <button
                  type="button"
                  className="grid size-7 place-items-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
                  aria-label={copy.fullscreen}
                >
                  <Maximize className="size-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-3 flex max-w-[61.25rem] items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[0.75rem] font-medium">{active.title}</p>
              <p className="mt-0.5 truncate text-[0.6875rem] text-muted-foreground">
                {selectedModel.name} · {aspect} ·{" "}
                {isVideo ? duration : copy.imageUnit} ·{" "}
                {formatUSD(cost)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] px-2 text-[0.6875rem] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                <Heart className="size-3" />
                {active.likes.toLocaleString("en-US")}
              </button>
              <button
                type="button"
                className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] px-2 text-[0.6875rem] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                <Download className="size-3" />
                {copy.download}
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
