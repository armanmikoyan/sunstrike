import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { mosaicTiles } from "./constants";
import { MosaicTile } from "./mosaic-tile";

export function RatioMosaic() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="w-full px-5 py-12">
        <SectionHeader
          title={
            <>
              Every frame finds its{" "}
              <span className="font-serif italic text-brand">shape</span>
            </>
          }
          description="Stills and motion across every ratio, without rebuilding the shot."
          action={
            <p className="font-mono text-[0.6875rem] text-muted-foreground/70">
              8 frames
            </p>
          }
          className="mb-6"
        />

        <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 md:auto-rows-auto md:grid-cols-12 md:grid-rows-[13.125rem_11.875rem_13.75rem] lg:grid-rows-[18.75rem_15rem_17.5rem]">
          {mosaicTiles.map((tile) => (
            <MosaicTile key={tile.id} {...tile} />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            asChild
            className="h-10 rounded-lg bg-brand px-4 text-[0.75rem] font-medium text-brand-foreground hover:bg-brand-hover"
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
