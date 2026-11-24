import { Gem } from "lucide-react";
import { cn } from "cn";
import type { PricingIconProps } from "./types";

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
