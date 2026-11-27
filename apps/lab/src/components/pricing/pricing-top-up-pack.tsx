"use client";

import { ArrowRight, Check } from "lucide-react";
import { cn } from "cn";
import { PRICING_COPY } from "./constants";
import type { PricingTopUpPackProps } from "./types";

export function PricingTopUpPack({ pack, selected, onSelect }: PricingTopUpPackProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${PRICING_COPY.topUps.select} ${PRICING_COPY.topUps.currency}${pack.price}`}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border p-3 text-left transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none lg:min-w-25 lg:flex-1 lg:basis-0"
      style={{
        borderColor: selected ? pack.accent : pack.popular ? `${pack.accent}80` : `${pack.accent}3d`,
        backgroundColor: selected ? pack.accent : undefined,
        backgroundImage: selected
          ? undefined
          : `linear-gradient(160deg, ${pack.accent}33 0%, rgba(255, 255, 255, 0.01) 62%, rgba(255, 255, 255, 0.02) 100%)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-px"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent, ${pack.accent}, transparent)`,
          opacity: selected ? 0.95 : 0.5,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: selected
            ? "linear-gradient(160deg, rgba(255, 255, 255, 0.18) 0%, transparent 62%)"
            : `linear-gradient(160deg, ${pack.accent}33 0%, transparent 64%)`,
        }}
      />
      <div className="relative flex items-start justify-between gap-1.5">
        <span
          className={cn(
            "text-lg leading-none tracking-[-0.03em] tabular-nums",
            selected ? "text-brand-foreground" : "bg-clip-text text-transparent",
          )}
          style={
            selected ? undefined : { backgroundImage: `linear-gradient(160deg, #ffffff 10%, ${pack.accent} 130%)` }
          }
        >
          {`${PRICING_COPY.topUps.currency}${pack.price}`}
        </span>
        {pack.popular ? (
          <span
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs lg:text-[0.6875rem] leading-none",
              selected ? "bg-black/15 text-brand-foreground" : "bg-white/8 text-foreground/75",
            )}
          >
            {PRICING_COPY.topUps.popular}
          </span>
        ) : null}
      </div>
      <div className="relative mt-auto flex items-end justify-between gap-1.5 pt-3">
        <span
          className={cn("text-xs lg:text-[0.6875rem]", selected ? "text-brand-foreground/75" : "text-muted-foreground")}
        >
          {pack.note}
        </span>
        {selected ? (
          <Check className="size-3.5 shrink-0 text-brand-foreground" strokeWidth={2.2} />
        ) : (
          <ArrowRight className="size-3 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        )}
      </div>
    </button>
  );
}
