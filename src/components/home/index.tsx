import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PromptComposer } from "@/components/prompt-composer";
import { RatioMosaic } from "@/components/ratio-mosaic";
import { VideoWall } from "@/components/video-wall";
import { MediaCard } from "@/components/media-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/ui/button";
import { mediaById } from "@/mocks/media";
import { MosaicTile } from "@/components/ratio-mosaic/mosaic-tile";
import {
  featuredIds,
  homeCopy,
  pricingMosaicTiles,
  pricingPoints,
} from "./constants";

const featured = featuredIds
  .map((id) => mediaById(id))
  .filter((item) => item !== undefined);

export function Home() {
  return (
    <>
      <section className="relative h-[calc(100svh-3rem)] min-h-[32.5rem] overflow-hidden">
        <VideoWall />
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 md:pb-5">
          <PromptComposer className="mx-auto max-w-[47.5rem] text-left" />
        </div>
      </section>

      <section className="border-t border-border/70">
        <div className="w-full px-5 py-16">
          <SectionHeader
            title={
              <>
                {homeCopy.gallery.titleBefore}
                <span className="font-serif italic text-brand">
                  {homeCopy.gallery.titleAccent}
                </span>
              </>
            }
            description={homeCopy.gallery.description}
            action={
              <Button
                asChild
                variant="ghost"
                className="hidden h-8 rounded-lg px-2.5 text-[0.75rem] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground sm:flex"
              >
                <Link href="/explore">
                  {homeCopy.gallery.action}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            }
            className="mb-6"
          />

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {featured.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <RatioMosaic />

      <section className="w-full px-5 py-16">
        <div className="glass-panel overflow-hidden rounded-2xl border border-white/[0.1]">
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="max-w-[35rem] font-grotesk text-[clamp(1.875rem,4vw,2.875rem)] font-medium leading-[1.05] tracking-[-0.045em]">
                  {homeCopy.pricing.titleBefore}
                  <span className="font-serif italic text-brand">
                    {homeCopy.pricing.titleAccent}
                  </span>
                  {homeCopy.pricing.titleAfter}
                </h2>
                <p className="mt-3 max-w-[30rem] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {homeCopy.pricing.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                  {pricingPoints.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground"
                    >
                      <Check className="size-3.5 text-muted-foreground" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  className="h-10 rounded-lg bg-brand px-4 text-[0.75rem] font-medium text-brand-foreground hover:bg-brand-hover"
                >
                  <Link href="/pricing">
                    {homeCopy.pricing.primaryAction}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-lg border-white/10 bg-transparent px-4 text-[0.75rem] text-foreground hover:bg-white/[0.04]"
                >
                  <Link href="/billing">
                    {homeCopy.pricing.secondaryAction}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-10 border-t border-white/[0.07] pt-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-[0.8125rem] font-medium">
                    {homeCopy.pricing.resultsTitle}
                  </h3>
                  <p className="mt-1 text-[0.75rem] text-muted-foreground">
                    {homeCopy.pricing.resultsDescription}
                  </p>
                </div>
                <Link
                  href="/explore"
                  className="flex items-center gap-1 text-[0.75rem] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {homeCopy.pricing.resultsAction}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
              <div className="mt-4 grid auto-rows-[8rem] grid-cols-2 gap-3 lg:auto-rows-[7.5rem] lg:grid-cols-12">
                {pricingMosaicTiles.map((tile) => (
                  <MosaicTile key={tile.id} {...tile} showCost />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
