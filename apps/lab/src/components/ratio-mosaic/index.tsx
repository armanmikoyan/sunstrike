import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/ui/button";
import { MOSAIC_COPY, MOSAIC_TILES } from "./constants";
import { MosaicTile } from "./mosaic-tile";

export function RatioMosaic() {
  return (
    <section className="border-t border-border/70">
      <div className="w-full px-5 py-16">
        <SectionHeader
          title={
            <>
              {MOSAIC_COPY.titleBefore}
              {MOSAIC_COPY.titleAccent}
            </>
          }
          description={MOSAIC_COPY.description}
          action={
            <div className="flex items-center gap-4">
              <p className="font-mono text-xs lg:text-[0.6875rem] text-muted-foreground">{MOSAIC_COPY.count}</p>
              <Button asChild variant="quiet" className="hidden sm:flex">
                <Link href="/explore">
                  {MOSAIC_COPY.action}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          }
          className="mb-6"
        />

        <div className="grid auto-rows-40 grid-cols-2 gap-3 md:auto-rows-auto md:grid-cols-12 md:grid-rows-[13.125rem_11.875rem_13.75rem] lg:grid-rows-[18.75rem_15rem_17.5rem]">
          {MOSAIC_TILES.map((tile) => (
            <MosaicTile key={tile.id} {...tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
