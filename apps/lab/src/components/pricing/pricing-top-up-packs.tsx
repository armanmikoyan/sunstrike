"use client";

import { topUpPacks } from "@/mocks/pricing";
import { PricingTopUpPack } from "./pricing-top-up-pack";
import type { PricingTopUpPacksProps } from "./types";

export function PricingTopUpPacks({ amount, onSelect }: PricingTopUpPacksProps) {
  // The custom amount drives the presets, so dragging the slider highlights
  // the nearest pack and clicking a pack moves the slider to its price.
  const activeIndex = topUpPacks.reduce(
    (closest, pack, index) =>
      Math.abs(amount - pack.price) < Math.abs(amount - topUpPacks[closest].price) ? index : closest,
    0,
  );

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-nowrap">
      {topUpPacks.map((pack, index) => (
        <PricingTopUpPack
          key={pack.id}
          pack={pack}
          selected={index === activeIndex}
          onSelect={() => onSelect(pack.price)}
        />
      ))}
    </div>
  );
}
