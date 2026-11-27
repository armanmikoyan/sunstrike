"use client";

import { ArrowRight, Check } from "lucide-react";
import { cn } from "cn";
import { useHaptics } from "@/hooks/use-haptics";
import { PRICING_COPY } from "./constants";
import type { PricingTopUpPackProps } from "./types";

// Each pack keeps its own accent when selected, but the surface stays a
// translucent wash instead of a flat fill so the text keeps its contrast.
const selectionBorder = (accent: string) => accent;
const selectionWash = (accent: string) => `${accent}14`;
const selectionGradient = (accent: string) =>
  `linear-gradient(155deg, ${accent}38 0%, ${accent}14 55%, ${accent}05 100%)`;

export function PricingTopUpPack({ pack, selected, onSelect }: PricingTopUpPackProps) {
  const { pulse } = useHaptics();

  return (
    <button
      type="button"
      onClick={() => {
        pulse(10);
        onSelect();
      }}
      aria-pressed={selected}
      aria-label={`${PRICING_COPY.topUps.select} ${PRICING_COPY.topUps.currency}${pack.price}`}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border p-3 text-left transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none lg:min-w-25 lg:flex-1 lg:basis-0"
      style={{
        borderColor: selected ? selectionBorder(pack.accent) : `${pack.accent}3d`,
        backgroundColor: selected ? selectionWash(pack.accent) : undefined,
        backgroundImage: selected
          ? selectionGradient(pack.accent)
          : `linear-gradient(160deg, ${pack.accent}26 0%, rgba(255, 255, 255, 0.01) 62%, rgba(255, 255, 255, 0.02) 100%)`,
        boxShadow: selected ? `inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 34px -20px ${pack.accent}99` : undefined,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-px"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent, ${pack.accent}, transparent)`,
          opacity: selected ? 1 : 0.5,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: `linear-gradient(160deg, ${pack.accent}33 0%, transparent 62%)`,
        }}
      />
      <div className="relative flex items-start justify-between gap-1.5">
        <span
          className={cn(
            "text-lg leading-none tracking-[-0.03em] tabular-nums",
            selected ? "text-foreground" : "bg-clip-text text-transparent",
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
              selected ? "bg-white/10 text-foreground" : "bg-white/6 text-foreground/70",
            )}
          >
            {PRICING_COPY.topUps.popular}
          </span>
        ) : null}
      </div>
      <div className="relative mt-auto flex items-end justify-between gap-1.5 pt-3">
        <span className="text-xs text-muted-foreground lg:text-[0.6875rem]">{pack.note}</span>
        {selected ? (
          <Check className="size-3.5 shrink-0" strokeWidth={2.2} style={{ color: pack.accent }} />
        ) : (
          <ArrowRight className="size-3 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        )}
      </div>
    </button>
  );
}
