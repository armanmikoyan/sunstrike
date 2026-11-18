"use client";

import { useState } from "react";
import { getImageQuote } from "@/components/pricing/utils";
import { PricingImageOrderCta } from "./pricing-image-order-cta";
import { PricingImageOrderQuantity } from "./pricing-image-order-quantity";
import { PricingImageOrderSummary } from "./pricing-image-order-summary";
import { PricingImageOrderTiers } from "./pricing-image-order-tiers";

export function ImageOrderCard() {
  const [quantity, setQuantity] = useState(10);
  const quote = getImageQuote(quantity);

  return (
    <div className="relative mx-auto h-full w-full max-w-95 overflow-hidden rounded-2xl border border-white/10 glass-card">
      <div className="flex h-full flex-col p-5">
        <PricingImageOrderQuantity quote={quote} onQuantityChange={setQuantity} />
        <PricingImageOrderTiers quote={quote} onQuantityChange={setQuantity} />
        <PricingImageOrderSummary quote={quote} />
        <PricingImageOrderCta quote={quote} />
      </div>
    </div>
  );
}
