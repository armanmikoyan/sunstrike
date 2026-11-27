"use client";

import { Minus, Plus } from "lucide-react";
import { RollingNumber } from "@/motion/rolling-number";
import { amountLabel } from "@/components/pricing/utils";
import { useHaptics } from "@/hooks/use-haptics";
import { PRICING_COPY } from "./constants";
import { QuantityButton } from "./pricing-quantity-button";
import { SegmentedSlider } from "./segmented-slider";
import type { PricingTopUpAmountProps } from "./types";

export function PricingTopUpAmount({ amount, onAmountChange }: PricingTopUpAmountProps) {
  const { pulse } = useHaptics();

  const changeAmount = (direction: -1 | 1) => {
    pulse();
    onAmountChange(
      Math.min(
        PRICING_COPY.topUps.custom.max,
        Math.max(PRICING_COPY.topUps.custom.min, amount + direction * PRICING_COPY.topUps.custom.step),
      ),
    );
  };

  return (
    <div className="min-w-0 border-t border-white/7 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
      <div className="flex items-center justify-between gap-3">
        <RollingNumber
          value={amount}
          useGrouping
          prefix={PRICING_COPY.topUps.currency}
          className="text-[2rem] font-normal leading-none tracking-[-0.03em]"
        />
        <div className="flex items-center gap-1">
          <QuantityButton
            onClick={() => changeAmount(-1)}
            disabled={amount <= PRICING_COPY.topUps.custom.min}
            aria-label={PRICING_COPY.topUps.custom.decreaseAmount}
          >
            <Minus className="size-4" strokeWidth={2} />
          </QuantityButton>
          <QuantityButton
            onClick={() => changeAmount(1)}
            disabled={amount >= PRICING_COPY.topUps.custom.max}
            aria-label={PRICING_COPY.topUps.custom.increaseAmount}
          >
            <Plus className="size-4" strokeWidth={2} />
          </QuantityButton>
        </div>
      </div>

      <SegmentedSlider
        value={amount}
        min={PRICING_COPY.topUps.custom.min}
        max={PRICING_COPY.topUps.custom.max}
        step={PRICING_COPY.topUps.custom.step}
        onValueChange={onAmountChange}
        label={PRICING_COPY.topUps.custom.amountLabel}
        className="mt-4"
      />
      <div className="mt-2 flex justify-between text-xs lg:text-[0.6875rem] font-normal tracking-normal text-muted-foreground">
        <span>{amountLabel(PRICING_COPY.topUps.custom.min)}</span>
        <span>{amountLabel(PRICING_COPY.topUps.custom.max)}</span>
      </div>
    </div>
  );
}
