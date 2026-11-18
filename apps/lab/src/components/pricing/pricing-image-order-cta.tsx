import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RollingNumber } from "@/motion/rolling-number";
import { Button } from "@/ui/button";
import { PRICING_CARD_COPY } from "./constants";
import type { ImageOrderQuoteProps } from "./types";

export function PricingImageOrderCta({ quote }: ImageOrderQuoteProps) {
  return (
    <>
      <Button asChild size="cta" className="mt-5 w-full">
        <Link href="/settings/billing">
          {PRICING_CARD_COPY.get} <RollingNumber value={quote.quantity} /> {PRICING_CARD_COPY.imagesLower}
          <ArrowRight className="size-3.5" />
        </Link>
      </Button>
      <p className="mt-3 text-center font-mono text-xs lg:text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground/65">
        {PRICING_CARD_COPY.paymentNote}
      </p>
    </>
  );
}
