"use client";

import { useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { topUpPacks } from "@/mocks/pricing";
import { cn } from "@/lib/utils";
import { pricingCopy } from "./constants";
import { PricingCustomTopUp } from "./pricing-custom-top-up";

type PricingModel = {
  slug: string;
  displayName: string;
  perSecond?: number;
  perImage?: number;
};

type PricingTopUpsProps = {
  videoModels: PricingModel[];
  imageModels: PricingModel[];
};

/**
 * The preset tiles and the custom amount are one control: picking a tile sets
 * the amount in the bar below, and the bar keeps the matching tile selected.
 */
export function PricingTopUps({ videoModels, imageModels }: PricingTopUpsProps) {
  const { topUps } = pricingCopy;
  const popular = topUpPacks.find((pack) => pack.popular) ?? topUpPacks[0];
  const [amount, setAmount] = useState(popular.price);
  // The closest preset stays lit, so $40 lights $50 while $20 falls back to $5.
  const activeIndex = topUpPacks.reduce(
    (closest, pack, index) =>
      Math.abs(amount - pack.price) < Math.abs(amount - topUpPacks[closest].price) ? index : closest,
    0,
  );

  return (
    <>
      <SectionHeader
        title={topUps.title}
        description={topUps.description}
        action={
          <span className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            {topUps.secure}
          </span>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-nowrap">
        {topUpPacks.map((pack, index) => {
          const selected = index === activeIndex;

          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => setAmount(pack.price)}
              aria-pressed={selected}
              aria-label={`${topUps.select} ${topUps.currency}${pack.price}`}
              className={cn(
                "group relative flex min-w-0 flex-col overflow-hidden rounded-lg border p-3 text-left transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none lg:min-w-[6.25rem] lg:flex-1 lg:basis-0",
              )}
              style={{
                borderColor: selected ? `${pack.accent}b3` : pack.popular ? `${pack.accent}80` : `${pack.accent}3d`,
                backgroundImage: selected
                  ? `linear-gradient(150deg, ${pack.accent} 0%, ${pack.accent}99 42%, #14121c 100%)`
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
                    ? "linear-gradient(160deg, rgba(255, 255, 255, 0.12) 0%, transparent 62%)"
                    : `linear-gradient(160deg, ${pack.accent}33 0%, transparent 64%)`,
                }}
              />
              <div className="relative flex items-start justify-between gap-1.5">
                <span
                  className="bg-clip-text text-[1.125rem] leading-none tracking-[-0.03em] tabular-nums text-transparent"
                  style={{
                    backgroundImage: selected
                      ? "linear-gradient(160deg, #ffffff 20%, rgba(255, 255, 255, 0.72) 100%)"
                      : `linear-gradient(160deg, #ffffff 10%, ${pack.accent} 130%)`,
                  }}
                >
                  {`${topUps.currency}${pack.price}`}
                </span>
                {pack.popular ? (
                  <span
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs lg:text-[0.6875rem] leading-none",
                      selected ? "bg-white/25 text-white" : "bg-white/8 text-foreground/75",
                    )}
                  >
                    {topUps.popular}
                  </span>
                ) : null}
              </div>
              <div className="relative mt-auto flex items-end justify-between gap-1.5 pt-3">
                <span
                  className={cn("text-xs lg:text-[0.6875rem]", selected ? "text-white/80" : "text-muted-foreground")}
                >
                  {pack.note}
                </span>
                {selected ? (
                  <Check
                    className={cn("size-3.5 shrink-0", selected ? "text-white" : "text-foreground")}
                    strokeWidth={2.2}
                  />
                ) : (
                  <ArrowRight
                    className={cn(
                      "size-3 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none",
                      selected ? "text-white/80" : "text-muted-foreground",
                    )}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-2.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
        {topUps.balance} · {topUps.neverExpires}
      </p>

      <PricingCustomTopUp
        videoModels={videoModels}
        imageModels={imageModels}
        amount={amount}
        onAmountChange={setAmount}
      />

      <p className="mt-3 text-xs lg:text-[0.6875rem] text-muted-foreground">{topUps.capacityNote}</p>
    </>
  );
}
