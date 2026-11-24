"use client";

import { cn } from "cn";
import { PRICING_CARD_COPY } from "./constants";
import type { ImageOrderTierProps } from "./types";

export function PricingImageOrderTier({ label, price, active, onSelect }: ImageOrderTierProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "rounded-xl border p-2.5 text-left transition-colors",
        active
          ? "border-brand-secondary/40 bg-brand-secondary/10 hover:border-brand-secondary/55 hover:bg-brand-secondary/15"
          : "border-white/10 hover:border-white/25 hover:bg-white/4",
      )}
    >
      <span
        className={cn(
          "font-mono text-xs lg:text-[0.6875rem] uppercase tracking-[0.1em]",
          active ? "text-brand-secondary" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      <span className="mt-1.5 flex flex-wrap items-baseline gap-x-1 text-sm lg:text-xs font-medium tracking-[-0.02em] text-foreground">
        <span className="tabular-nums font-normal">{price}</span>
        <span className="text-xs lg:text-[0.6875rem] font-normal text-muted-foreground">
          {PRICING_CARD_COPY.imageUnit}
        </span>
      </span>
    </button>
  );
}
