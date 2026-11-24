"use client";

import { RollingNumber } from "@/motion/rolling-number";
import { QuantityButton } from "@/components/pricing/pricing-quantity-button";
import { QuantitySlider } from "@/components/pricing/pricing-quantity-slider";
import { MAX_IMAGES, MIN_IMAGES } from "@/components/pricing/constants";
import { PRICING_CARD_COPY } from "./constants";
import type { ImageOrderProps } from "./types";

export function PricingImageOrderQuantity({ quote, onQuantityChange }: ImageOrderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs lg:text-[0.6875rem] text-muted-foreground">{PRICING_CARD_COPY.yourOrder}</span>
        <span className="font-mono text-xs lg:text-[0.6875rem] text-muted-foreground">{PRICING_CARD_COPY.payg}</span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs lg:text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            {PRICING_CARD_COPY.images}
          </p>
          <div className="mt-1 flex items-end gap-2">
            <RollingNumber value={quote.quantity} className="text-3xl font-medium leading-none tracking-[-0.03em]" />
            <span className="pb-1 text-xs lg:text-[0.6875rem] text-muted-foreground">
              {PRICING_CARD_COPY.imagesLower}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <QuantityButton
            onClick={() => onQuantityChange(Math.max(MIN_IMAGES, quote.quantity - 1))}
            disabled={quote.quantity <= MIN_IMAGES}
            aria-label={PRICING_CARD_COPY.decreaseImages}
          >
            −
          </QuantityButton>
          <QuantityButton
            onClick={() => onQuantityChange(Math.min(MAX_IMAGES, quote.quantity + 1))}
            disabled={quote.quantity >= MAX_IMAGES}
            aria-label={PRICING_CARD_COPY.increaseImages}
          >
            +
          </QuantityButton>
        </div>
      </div>

      <QuantitySlider
        value={quote.quantity}
        min={MIN_IMAGES}
        max={MAX_IMAGES}
        onValueChange={onQuantityChange}
        ariaLabel={PRICING_CARD_COPY.numberOfImages}
        className="mt-5"
      />
      <div className="mt-2 flex justify-between font-mono text-xs lg:text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground/70">
        <span>{PRICING_CARD_COPY.imageRangeStart}</span>
        <span>{PRICING_CARD_COPY.imageRangeEnd}</span>
      </div>
    </>
  );
}
