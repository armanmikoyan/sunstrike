"use client";

import Image from "next/image";
import { Link } from "@/components/link";
import { ImagePlus, Layers3, Upload, X } from "lucide-react";
import { mediaById } from "@/mocks/media";
import { STUDIO_COPY } from "./constants";
import type { StudioScopedProps } from "./types";

export function StudioReferencesField({ studio: { attachment, fileInputRef, setAttachment } }: StudioScopedProps) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <p className="text-xs lg:text-[0.6875rem] font-medium text-muted-foreground">
          {STUDIO_COPY.controls.references}
        </p>
        <Link
          href="/library"
          className="flex items-center gap-1 text-xs lg:text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <Layers3 className="size-2.5" />
          {STUDIO_COPY.controls.library}
        </Link>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setAttachment(file.name);
        }}
      />
      <div className="mt-2 grid grid-cols-[1fr_3.625rem] gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-17.5 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/11 bg-white/1.5 text-muted-foreground transition-colors hover:border-white/20 hover:bg-white/3 hover:text-foreground"
        >
          <Upload className="size-3.5" />
          <span className="text-xs lg:text-[0.6875rem]">{STUDIO_COPY.controls.dropReference}</span>
        </button>
        {attachment ? (
          <div className="group relative flex h-17.5 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/3">
            <Image
              src={mediaById("02")?.poster ?? ""}
              alt={STUDIO_COPY.controls.referenceAlt}
              fill
              sizes="58px"
              className="object-cover opacity-80"
            />
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-black/65 text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={STUDIO_COPY.controls.removeReference}
            >
              <X className="size-2.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/library"
            className="flex h-17.5 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/8 bg-white/1.5 text-muted-foreground transition-colors hover:bg-white/4 hover:text-foreground"
          >
            <ImagePlus className="size-3.5" />
            <span className="text-xs lg:text-[0.6875rem]">{STUDIO_COPY.controls.library}</span>
          </Link>
        )}
      </div>
      {attachment ? (
        <div className="mt-1.5 flex items-center justify-between text-xs lg:text-[0.6875rem]">
          <span className="max-w-55 truncate text-muted-foreground">{attachment}</span>
          <button type="button" onClick={() => setAttachment(null)} className="text-foreground">
            {STUDIO_COPY.controls.clear}
          </button>
        </div>
      ) : null}
    </div>
  );
}
