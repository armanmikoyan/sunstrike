"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Image as ImageIcon, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudioState } from "./hooks";

export function StudioTakes({ studio }: { studio: StudioState }) {
  const { takes, active, activeId, setActiveId, isVideo } = studio;

  return (
    <div className="mx-auto mt-7 max-w-[61.25rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[0.6875rem] font-medium text-muted-foreground">
            Recent takes
          </span>
          <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
            {takes.length}
          </span>
        </div>
        <Link
          href="/library"
          className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
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
              "group relative aspect-[3/4] overflow-hidden rounded-lg border bg-secondary text-left transition-colors",
              activeId === item.id
                ? "border-white/30 ring-1 ring-white/15"
                : "border-white/[0.07] hover:border-white/20",
            )}
          >
            <Image
              src={item.poster}
              alt={item.title}
              fill
              sizes="200px"
              className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <span className="absolute left-1.5 top-1.5 grid size-4 place-items-center rounded bg-black/35 text-white/80 backdrop-blur">
              {isVideo ? (
                <Play className="size-2 fill-current" />
              ) : (
                <ImageIcon className="size-2" />
              )}
            </span>
            {active.id === item.id ? (
              <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-foreground text-background">
                <Check className="size-2.5" />
              </span>
            ) : null}
            <span className="absolute inset-x-1.5 bottom-1.5 truncate text-[0.6875rem] text-white/80">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
