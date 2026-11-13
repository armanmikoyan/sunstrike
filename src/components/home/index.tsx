import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PromptComposer } from "@/components/prompt-composer";
import { ImageOrderCard } from "@/components/pricing";
import { RatioMosaic } from "@/components/ratio-mosaic";
import { VideoWall } from "@/components/video-wall";
import { MediaCard } from "@/components/media-card";
import { SectionHeader } from "@/components/section-header";
import { ClipStrip } from "@/components/clip-strip";
import { Button } from "@/ui/button";
import { mediaById } from "@/mocks/media";
import {
  featuredIds,
  homeCopy,
  pricingClipIds,
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
          <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_23.75rem] lg:p-12">
            <div className="flex flex-col gap-7">
              <div>
                <h2 className="max-w-[35rem] font-grotesk text-[clamp(1.875rem,4vw,2.875rem)] font-medium leading-[1.05] tracking-[-0.045em]">
                  {homeCopy.pricing.titleBefore}
                  <span className="font-serif italic text-brand">
                    {homeCopy.pricing.titleAccent}
                  </span>
                  {homeCopy.pricing.titleAfter}
                </h2>
                <p className="mt-3 max-w-[28.75rem] text-[0.8125rem] leading-relaxed text-muted-foreground">
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
                <div className="mt-7 flex flex-wrap items-center gap-2">
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

              <ClipStrip
                ids={pricingClipIds}
                className="hidden min-h-[7.5rem] flex-1 lg:flex"
              />
            </div>

            <ImageOrderCard />
          </div>
        </div>
      </section>

    </>
  );
}
