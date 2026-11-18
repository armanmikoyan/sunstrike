import { RollingNumber } from "@/motion/rolling-number";
import { PRICING_CARD_COPY } from "./constants";
import { cn } from "cn";
import type { ImageOrderQuoteProps } from "./types";

export function PricingImageOrderSummary({ quote }: ImageOrderQuoteProps) {
  return (
    <>
      <div className="mt-5 space-y-2.5 border-t border-white/7 pt-4 text-xs lg:text-[0.6875rem]">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{PRICING_CARD_COPY.images}</span>
          <RollingNumber value={quote.quantity} />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{PRICING_CARD_COPY.perImage}</span>
          <RollingNumber value={quote.unit} decimalPlaces={2} prefix={PRICING_CARD_COPY.currency} />
        </div>
        <div
          aria-hidden={quote.savings <= 0}
          className={cn("flex justify-between text-brand-secondary", quote.savings <= 0 && "invisible")}
        >
          <span>{PRICING_CARD_COPY.volumeSaving}</span>
          <RollingNumber value={quote.savings} decimalPlaces={2} prefix={PRICING_CARD_COPY.negativeCurrency} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-white/7 pt-4">
        <span className="text-sm lg:text-xs text-muted-foreground">{PRICING_CARD_COPY.total}</span>
        <RollingNumber
          value={quote.total}
          decimalPlaces={2}
          prefix={PRICING_CARD_COPY.currency}
          className="text-3xl font-medium leading-none tracking-[-0.03em]"
        />
      </div>
    </>
  );
}
