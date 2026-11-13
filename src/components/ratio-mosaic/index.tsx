import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/ui/button";
import { mosaicCopy, mosaicTiles } from "./constants";
import { MosaicTile } from "./mosaic-tile";

export function RatioMosaic() {
  return (
    <section className="border-t border-border/70">
      <div className="w-full px-5 py-16">
        <SectionHeader
          title={
            <>
              {mosaicCopy.titleBefore}
              <span className="font-serif italic text-brand">
                {mosaicCopy.titleAccent}
              </span>
            </>
          }
          description={mosaicCopy.description}
          action={
            <div className="flex items-center gap-4">
              <p className="font-mono text-[0.6875rem] text-muted-foreground/70">
                {mosaicCopy.count}
              </p>
              <Button
                asChild
                variant="ghost"
                className="hidden h-8 rounded-lg px-2.5 text-[0.75rem] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground sm:flex"
              >
                <Link href="/explore">
                  {mosaicCopy.action}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          }
          className="mb-6"
        />

        <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 md:auto-rows-auto md:grid-cols-12 md:grid-rows-[13.125rem_11.875rem_13.75rem] lg:grid-rows-[18.75rem_15rem_17.5rem]">
          {mosaicTiles.map((tile) => (
            <MosaicTile key={tile.id} {...tile} />
          ))}
        </div>

      </div>
    </section>
  );
}
