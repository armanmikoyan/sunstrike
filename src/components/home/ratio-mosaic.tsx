import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Film, ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { VideoWithFallback } from "@/components/media/video-with-fallback";
import { Button } from "@/components/ui/button";
import { mediaById } from "@/lib/media";
import { cn } from "@/lib/utils";

const tiles = [
  {
    id: "09",
    label: "9:16",
    span: "col-span-2 row-span-2 md:col-span-5 md:row-span-2",
  },
  { id: "02", label: "9:16", span: "md:col-span-4" },
  { id: "05", label: "3:4", span: "md:col-span-3" },
  { id: "04", label: "9:16", span: "md:col-span-3" },
  { id: "07", label: "9:16", span: "md:col-span-4" },
  { id: "11", label: "9:16", span: "md:col-span-5" },
  { id: "16", label: "1:1", span: "md:col-span-4" },
  { id: "17", label: "3:4", span: "hidden md:block md:col-span-3" },
];

export function RatioMosaic() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="w-full px-5 py-12">
        <SectionHeader
          title={<>Every frame finds its <span className="font-serif italic text-brand">shape</span></>}
          description="Stills and motion across every ratio, without rebuilding the shot."
          action={
            <p className="font-mono text-[11px] text-muted-foreground/70">
              8 frames
            </p>
          }
          className="mb-6"
        />

        <div className="grid grid-cols-2 auto-rows-[160px] gap-3 md:grid-cols-12 md:auto-rows-auto md:grid-rows-[210px_190px_220px] lg:grid-rows-[300px_240px_280px]">
          {tiles.map((tile) => {
            const item = mediaById(tile.id);
            if (!item) return null;

            return (
              <Link
                key={tile.id}
                href={`/create/${item.kind}`}
                className={cn(
                  "group relative overflow-hidden rounded-xl bg-card transition-opacity hover:opacity-95",
                  tile.span,
                )}
              >
                {item.kind === "video" ? (
                  <VideoWithFallback
                    src={item.src}
                    poster={item.poster}
                    fallback={item.fallback}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/20" />

                <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md border border-white/15 bg-black/45 px-2 py-1 text-[11px] text-white/85 backdrop-blur-md">
                  {item.kind === "video" ? (
                    <Film className="size-3" />
                  ) : (
                    <ImageIcon className="size-3" />
                  )}
                  {item.kind === "video" ? "Video" : "Image"}
                </span>

                <span className="absolute right-2.5 top-2.5 rounded-md border border-white/15 bg-black/45 px-2 py-1 font-mono text-[11px] text-white/80 backdrop-blur-md">
                  {tile.label}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="truncate text-[12px] font-medium text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-white/60">
                    {item.model}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            asChild
            className="h-10 rounded-lg bg-brand px-4 text-[12px] font-medium text-brand-foreground hover:bg-brand-hover"
          >
            <Link href="/explore">
              Explore more
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
