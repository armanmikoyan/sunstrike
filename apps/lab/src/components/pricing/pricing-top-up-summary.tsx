import { PRICING_COPY } from "./constants";

export function PricingTopUpSummary() {
  return (
    <div>
      <p className="text-xs lg:text-[0.6875rem] font-medium">{PRICING_COPY.topUps.custom.name}</p>
      <p className="mt-1 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
        {PRICING_COPY.topUps.custom.description}
      </p>
      <p className="mt-3 text-xs lg:text-[0.6875rem] text-muted-foreground">{PRICING_COPY.topUps.custom.minMax}</p>
    </div>
  );
}
