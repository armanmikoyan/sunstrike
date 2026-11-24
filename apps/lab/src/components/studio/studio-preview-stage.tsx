"use client";

import Image from "next/image";
import { Maximize, Play } from "lucide-react";
import { MediaKindBadge } from "@/ui/media-kind-badge";
import { cn } from "cn";
import { STUDIO_COPY, STUDIO_FRAME_CLASSES } from "./constants";
import { StudioPreviewPlayback } from "./studio-preview-playback";
import type { StudioScopedProps } from "./types";

export function StudioPreviewStage({
  studio,
  studio: { active, aspect, duration, isVideo, resolution, selectedModel },
}: StudioScopedProps) {
  const frameClass = STUDIO_FRAME_CLASSES[aspect] ?? STUDIO_FRAME_CLASSES["16:9"];

  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-xl border border-white/10 bg-secondary shadow-[0_1.875rem_6.25rem_-2.5rem_rgba(0,0,0,0.9)] transition-[max-width,aspect-ratio] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
        frameClass,
      )}
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
      <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-black/25" />

      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <MediaKindBadge kind={isVideo ? "video" : "image"} label={selectedModel.displayName} />
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-1.5">
        <span className="rounded-md border border-white/15 bg-black/40 px-1.5 py-1 font-mono text-xs lg:text-[0.6875rem] text-white/65 backdrop-blur-md">
          {isVideo && duration ? `${duration} · ${resolution}` : resolution}
        </span>
      </div>

      <button
        type="button"
        aria-label={STUDIO_COPY.preview.play}
        className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white/90 backdrop-blur-md transition-colors hover:bg-black/55"
      >
        {isVideo ? <Play className="ml-0.5 size-4 fill-current" /> : <Maximize className="size-4" />}
      </button>

      <StudioPreviewPlayback studio={studio} />
    </div>
  );
}
