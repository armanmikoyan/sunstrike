import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Film, Heart, ImageIcon, Play } from "lucide-react";
import { VideoWithFallback } from "@/components/video-with-fallback";
import { cn } from "@/lib/utils";
import type { MediaCardProps } from "./types";

export function MediaCard({
  item,
  className,
  aspect,
  priority = false,
  showMeta = true,
}: MediaCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card",
        className,
      )}
    >
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-secondary"
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        {item.kind === "video" ? (
          <VideoWithFallback
            src={item.src}
            poster={item.poster}
            fallback={item.fallback}
            preload={priority ? "auto" : "metadata"}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image
            src={item.poster}
            alt={item.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-opacity duration-300"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-black/15 opacity-80" />

        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="flex items-center gap-1.5 rounded-md border border-white/15 bg-black/45 px-2 py-1 text-[0.6875rem] text-white/85 backdrop-blur-md">
            {item.kind === "video" ? (
              <Film className="size-3" />
            ) : (
              <ImageIcon className="size-3" />
            )}
            {item.kind === "video" ? "Video" : "Image"}
            {item.kind === "video" ? (
              <span className="font-mono text-white/65">{item.duration}</span>
            ) : null}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Save ${item.title}`}
          className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 opacity-0 backdrop-blur-md transition-opacity hover:bg-black/60 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Heart className="size-3" />
        </button>

        <div className="absolute inset-x-0 bottom-0">
          <div className="translate-y-1 p-3 opacity-0 transition-[transform,opacity] duration-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="line-clamp-2 text-[0.75rem] leading-relaxed text-white/75">
              {item.prompt}
            </p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <Link
                href={`/create/${item.kind}`}
                className="flex h-8 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[0.6875rem] font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <Play className="size-3 fill-current" />
                Remix
              </Link>
              <Link
                href="/explore"
                className="flex h-8 items-center gap-1.5 rounded-md border border-white/15 bg-black/35 px-2.5 text-[0.6875rem] font-medium text-white/85 backdrop-blur transition-colors hover:bg-black/55 hover:text-white"
              >
                Details
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </div>

          {showMeta ? (
            <div className="p-3 pt-0">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[0.8125rem] font-medium text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-[0.6875rem] text-white/65">
                    {item.author}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[0.6875rem] text-white/65">
                  <Heart className="size-3" />
                  {item.likes.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
