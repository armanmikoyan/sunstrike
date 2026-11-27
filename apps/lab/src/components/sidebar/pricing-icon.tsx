import { Gem } from "lucide-react";
import { cn } from "cn";
import type { PricingIconProps } from "./types";

export function PricingIcon({ className, strokeWidth = 1.8 }: PricingIconProps) {
  return <Gem className={cn("text-brand-secondary", className)} strokeWidth={strokeWidth} />;
}
