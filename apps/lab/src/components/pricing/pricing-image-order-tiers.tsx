"use client";

import { IMAGE_TIERS } from "./constants";
import { PricingImageOrderTier } from "./pricing-image-order-tier";
import type { ImageOrderProps } from "./types";
import { formatUSD, getImageTier } from "./utils";

export function PricingImageOrderTiers({ quote, onQuantityChange }: ImageOrderProps) {
  const activeTier = getImageTier(quote.quantity);

  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      {IMAGE_TIERS.map((tier) => (
        <PricingImageOrderTier
          key={tier.label}
          label={tier.label}
          price={formatUSD(tier.unit)}
          active={tier === activeTier}
          onSelect={() => onQuantityChange(tier.start)}
        />
      ))}
    </div>
  );
}
