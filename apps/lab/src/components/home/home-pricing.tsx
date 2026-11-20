import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { MosaicTile } from "@/components/ratio-mosaic/mosaic-tile";
import { Button } from "@/ui/button";
import { HOME_COPY, PRICING_MOSAIC_TILES, PRICING_POINTS } from "./constants";

/** The live pricing panel: offer on the left, recent results below. */
export function HomePricing() {
  return (
    <section className="w-full px-5 py-16">
      <div className="glass-panel overflow-hidden rounded-2xl border border-white/10">
        <div className="p-7 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 className="max-w-140 font-grotesk text-[clamp(1.75rem,3.6vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.045em]">
                {HOME_COPY.pricing.titleBefore}
                {HOME_COPY.pricing.titleAccent}
                {HOME_COPY.pricing.titleAfter}
              </h2>
              <p className="mt-3 max-w-120 text-sm lg:text-xs leading-relaxed text-muted-foreground">
                {HOME_COPY.pricing.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                {PRICING_POINTS.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground"
                  >
                    <Check className="size-3.5 text-muted-foreground" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild size="cta">
                <Link href="/pricing">
                  {HOME_COPY.pricing.primaryAction}
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-lg border-white/10 bg-transparent px-4 text-xs lg:text-[0.6875rem] text-foreground hover:bg-white/4"
              >
                <Link href="/settings/billing">{HOME_COPY.pricing.secondaryAction}</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 border-t border-white/7 pt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-sm lg:text-xs font-medium">{HOME_COPY.pricing.resultsTitle}</h3>
                <p className="mt-1 text-xs lg:text-[0.6875rem] text-muted-foreground">
                  {HOME_COPY.pricing.resultsDescription}
                </p>
              </div>
              <Link
                href="/explore"
                className="flex items-center gap-1 text-xs lg:text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {HOME_COPY.pricing.resultsAction}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-4 grid auto-rows-32 grid-cols-2 gap-3 lg:auto-rows-30 lg:grid-cols-12">
              {PRICING_MOSAIC_TILES.map((tile) => (
                <MosaicTile key={tile.id} {...tile} showCost />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
