import { Gem } from "lucide-react";
import { cn } from "cn";
import type { PricingIconProps } from "./types";

/**
 * Pricing gets a duotone gem: the outline and the girdle sit in the brand
 * secondary, while the inner facets are lifted to the brand tertiary so the
 * stone looks cut rather than tinted. Coins stay on the balance, where they
 * belong.
 *
 * Lucide paints every child with one `stroke`, so the facets are coloured
 * through their position: outline, inner V and girdle. A gradient was tried
 * first and read as a cheap stock tint at 18px.
 */
export function PricingIcon({ className, strokeWidth = 1.8 }: PricingIconProps) {
  return (
    <Gem
      className={cn(
        "text-brand-secondary",
        "[&>path:first-of-type]:stroke-brand-tertiary/80",
        "[&>path:last-of-type]:stroke-brand-tertiary/80",
        className,
      )}
      strokeWidth={strokeWidth}
    />
  );
}
