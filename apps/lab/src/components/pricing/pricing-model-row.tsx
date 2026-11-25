"use client";

import { StudioModelLogo } from "@/components/studio/studio-model-logo";
import { formatDurationRange } from "@/components/studio/utils";
import { formatUSD, formatUSDRate } from "./utils";
import { PRICING_COPY } from "./constants";
import type { PricingModelRowProps } from "./types";

export function PricingModelRow({ row: { kind, model } }: PricingModelRowProps) {
  const isVideo = kind === "video";

  return (
    <>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StudioModelLogo vendor={model.vendor} />
          <h3 className="text-[0.9375rem] font-medium tracking-[-0.015em]">{model.displayName}</h3>
          <span className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-xs lg:text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
            {isVideo ? PRICING_COPY.rates.videoLabel : PRICING_COPY.rates.imageLabel}
          </span>
        </div>
        <p className="mt-1 text-xs lg:text-[0.6875rem] text-muted-foreground">{model.summary}</p>
        <p className="mt-2 font-mono text-xs lg:text-[0.6875rem] text-muted-foreground/80">
          {model.capabilities.resolutions.join(" / ")}
          {isVideo
            ? ` · ${formatDurationRange(model.capabilities.durationsSeconds)} · ${
                model.capabilities.audio ? PRICING_COPY.rates.audio : PRICING_COPY.rates.silent
              }`
            : " · image"}
        </p>
      </div>

      <div className="md:text-right">
        <p className="flex items-baseline gap-1.5 text-[0.9375rem] font-medium tracking-[-0.02em] tabular-nums md:justify-end">
          {model.priceVaries ? (
            <span className="text-xs lg:text-[0.6875rem] font-normal tracking-normal text-muted-foreground">
              {PRICING_COPY.rates.from}
            </span>
          ) : null}
          <span className="tabular-nums font-normal">{formatUSDRate(model.unitPrice)}</span>
          <span className="text-xs lg:text-[0.6875rem] font-normal tracking-normal text-muted-foreground">
            {isVideo ? PRICING_COPY.rates.perSecond : PRICING_COPY.rates.perImage}
          </span>
        </p>
        {isVideo ? (
          <p className="mt-1 text-xs lg:text-[0.6875rem] text-muted-foreground">
            <span className="tabular-nums font-normal">{formatUSD(model.example.total)}</span>{" "}
            {PRICING_COPY.rates.clipBefore}
            {model.example.units}
            {PRICING_COPY.rates.clipAfter}
          </p>
        ) : null}
        {model.tiers.length > 0 ? (
          <p className="mt-1 text-xs lg:text-[0.6875rem] text-muted-foreground">
            {PRICING_COPY.rates.volume}{" "}
            {model.tiers.map((tier) => `${tier.minQuantity}+ ${formatUSDRate(tier.unitPrice)}`).join(" · ")}
          </p>
        ) : null}
      </div>
    </>
  );
}
