import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Film, ImageIcon } from "lucide-react";
import { Button } from "@/ui/button";
import { mediaById } from "@/lib/media";
import { cn } from "@/lib/utils";
import { megaMenuCopy } from "./constants";
import type { MegaMenuPanelProps } from "./types";

export function MegaMenuPanel({ menu, onClose, left }: MegaMenuPanelProps) {
  return (
    <div
      className="absolute top-12 z-50 w-[min(70rem,calc(100vw-2rem))]"
      style={{ left }}
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1e20] shadow-[0_1.875rem_7.5rem_rgba(0,0,0,0.65)]">
        <div className="grid min-h-[21.375rem] lg:grid-cols-[15.625rem_1fr_18.75rem]">
          <div className="flex flex-col justify-between border-b border-white/[0.07] p-6 lg:border-b-0 lg:border-r">
            <div>
              <div className="mb-4 text-[0.75rem] text-muted-foreground">
                {menu.eyebrow}
              </div>
              <h2 className="max-w-[13.75rem] text-[1.5625rem] font-medium leading-[1.1] tracking-[-0.03em]">
                {menu.title}
              </h2>
              <p className="mt-3 max-w-[14.375rem] text-[0.8125rem] leading-relaxed text-muted-foreground">
                {menu.description}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-6 w-fit rounded-lg border-white/10 bg-white/[0.035] text-[0.75rem] hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground"
            >
              <Link href={menu.href} onClick={onClose}>
                {menu.cta}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-1 border-b border-white/[0.07] p-4 sm:grid-cols-2 lg:border-b-0 lg:border-r">
            {menu.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.name}
                  href={feature.href}
                  onClick={onClose}
                  className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.045]"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-muted-foreground transition-colors group-hover:bg-white/[0.06] group-hover:text-foreground">
                    <Icon className="size-[0.9375rem]" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-[0.8125rem] font-medium text-foreground">
                      {feature.name}
                      <ArrowUpRight className="size-3 -translate-x-1 opacity-0 transition-[transform,opacity] group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-muted-foreground">
                      {feature.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="hidden p-3 lg:block">
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
              {menu.previews.map((id, index) => {
                const item = mediaById(id);
                if (!item) return null;
                return (
                  <Link
                    key={id}
                    href="/explore"
                    onClick={onClose}
                    className={cn(
                      "group relative overflow-hidden rounded-xl bg-secondary",
                      index === 0 && "row-span-2",
                    )}
                  >
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      sizes="180px"
                      className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <p className="text-[0.6875rem] font-medium text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[0.6875rem] text-white/65">
                        {item.model}
                      </p>
                    </div>
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-white/15 bg-black/45 px-1.5 py-0.5 text-[0.6875rem] text-white/80 backdrop-blur">
                      {item.kind === "video" ? (
                        <Film className="size-3" />
                      ) : (
                        <ImageIcon className="size-3" />
                      )}
                      {item.kind === "video" ? megaMenuCopy.video : megaMenuCopy.image}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] bg-white/[0.015] px-6 py-3">
          <p className="text-[0.6875rem] text-muted-foreground">
            {megaMenuCopy.priceNote}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              onClick={onClose}
              className="text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {megaMenuCopy.recentRenders}
            </Link>
            <Link
              href="/pricing"
              onClick={onClose}
              className="flex items-center gap-1 text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {megaMenuCopy.payg}
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
