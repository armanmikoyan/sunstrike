"use client";

import { IMAGE_TIERS } from "./constants";
import { PricingImageOrderTier } from "./pricing-image-order-tier";
import type { ImageOrderProps } from "./types";

export function PricingImageOrderTiers({ quote, onQuantityChange }: ImageOrderProps) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      {IMAGE_TIERS.map((tier) => (
        <PricingImageOrderTier
          key={tier.label}
          label={tier.label}
          price={tier.price}
          active={tier.active(quote.quantity)}
          onSelect={() => onQuantityChange(tier.start)}
        />
      ))}
    </div>
  );
}
