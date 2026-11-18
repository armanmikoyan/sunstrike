"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { CountBadge } from "@/ui/count-badge";
import { MediaKindBadge } from "@/ui/media-kind-badge";
import { cn } from "cn";
import { STUDIO_COPY } from "./constants";
import type { StudioScopedProps } from "./types";

export function StudioTakes({ studio: { takes, active, activeId, setActiveId, isVideo } }: StudioScopedProps) {
  return (
    <div className="mx-auto mt-7 max-w-245">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs lg:text-[0.6875rem] font-medium text-muted-foreground">
            {STUDIO_COPY.takes.title}
          </span>
          <CountBadge>{takes.length}</CountBadge>
        </div>
        <Link
          href="/library"
          className="flex items-center gap-1 text-xs lg:text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          {STUDIO_COPY.takes.viewAll}
          <ArrowUpRight className="size-2.5" />
        </Link>
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-2">
        {takes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={cn(
              "group relative aspect-3/4 overflow-hidden rounded-lg border bg-secondary text-left transition-colors",
              activeId === item.id ? "border-white/30 ring-1 ring-white/15" : "border-white/7 hover:border-white/20",
            )}
          >
            <Image
              src={item.poster}
              alt={item.title}
              fill
              sizes="200px"
              className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
            <MediaKindBadge kind={isVideo ? "video" : "image"} iconOnly className="absolute left-1.5 top-1.5" />
            {active.id === item.id ? (
              <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-foreground text-background">
                <Check className="size-2.5" />
              </span>
            ) : null}
            <span className="absolute inset-x-1.5 bottom-1.5 truncate text-xs lg:text-[0.6875rem] text-white/80">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
