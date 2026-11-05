"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RollingNumber } from "@/components/rolling-number";
import { Button } from "@/ui/button";
import { Slider } from "@/ui/slider";
import { QuantityButton, pricingSliderStyles } from "@/components/pricing/pricing-quantity-button";
import { imageTiers, pricingCardCopy } from "./constants";
import {
  MAX_IMAGES,
  MIN_IMAGES,
  getImageQuote,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function ImageOrderCard() {
  const [quantity, setQuantity] = useState(10);
  const quote = getImageQuote(quantity);

  return (
    <div className="relative mx-auto w-full max-w-[23.75rem] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#1c1e20]">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-[0.75rem] text-muted-foreground">{pricingCardCopy.yourOrder}</span>
          <span className="font-mono text-[0.6875rem] text-muted-foreground">
            {pricingCardCopy.payg}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              {pricingCardCopy.images}
            </p>
            <div className="mt-1 flex items-end gap-2">
              <RollingNumber
                value={quote.quantity}
                className="text-[2.125rem] font-medium leading-none tracking-[-0.03em]"
              />
              <span className="pb-1 text-[0.75rem] text-muted-foreground">
                {pricingCardCopy.imagesLower}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <QuantityButton
              onClick={() =>
                setQuantity((value) => Math.max(MIN_IMAGES, value - 1))
              }
              disabled={quantity <= MIN_IMAGES}
              aria-label={pricingCardCopy.decreaseImages}
            >
              −
            </QuantityButton>
            <QuantityButton
              onClick={() =>
                setQuantity((value) => Math.min(MAX_IMAGES, value + 1))
              }
              disabled={quantity >= MAX_IMAGES}
              aria-label={pricingCardCopy.increaseImages}
            >
              +
            </QuantityButton>
          </div>
        </div>

        <Slider
          value={[quantity]}
          min={MIN_IMAGES}
          max={MAX_IMAGES}
          step={1}
          onValueChange={([value]) => setQuantity(value)}
          aria-label={pricingCardCopy.numberOfImages}
          className={cn("mt-5 w-full", pricingSliderStyles)}
        />
        <div className="mt-2 flex justify-between font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground/70">
          <span>{pricingCardCopy.imageRangeStart}</span>
          <span>{pricingCardCopy.imageRangeEnd}</span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {imageTiers.map((tier) => {
            const active = tier.active(quote.quantity);
            return (
              <button
                key={tier.label}
                type="button"
                onClick={() => setQuantity(tier.start)}
                aria-pressed={active}
                className={cn(
                  "rounded-xl border p-2.5 text-left transition-colors",
                  active
                    ? "border-brand-secondary/40 bg-brand-secondary/10 hover:border-brand-secondary/55 hover:bg-brand-secondary/15"
                    : "border-white/[0.1] hover:border-white/25 hover:bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[0.6875rem] uppercase tracking-[0.1em]",
                    active ? "text-brand-secondary" : "text-muted-foreground",
                  )}
                >
                  {tier.label}
                </span>
                <span className="mt-1.5 flex flex-wrap items-baseline gap-x-1 text-[0.8125rem] font-medium tracking-[-0.02em] text-foreground">
                  {tier.price}
                  <span className="text-[0.6875rem] font-normal text-muted-foreground">
                    {pricingCardCopy.imageUnit}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-4 text-[0.75rem]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{pricingCardCopy.images}</span>
            <RollingNumber value={quote.quantity} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{pricingCardCopy.perImage}</span>
            <RollingNumber
              value={quote.unit}
              decimalPlaces={2}
              prefix={pricingCardCopy.currency}
            />
          </div>
          <div
            aria-hidden={quote.savings <= 0}
            className={cn(
              "flex justify-between text-brand-secondary",
              quote.savings <= 0 && "invisible",
            )}
          >
            <span>{pricingCardCopy.volumeSaving}</span>
            <RollingNumber
              value={quote.savings}
              decimalPlaces={2}
              prefix={pricingCardCopy.negativeCurrency}
            />
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-white/[0.07] pt-4">
          <span className="text-[0.8125rem] text-muted-foreground">{pricingCardCopy.total}</span>
          <RollingNumber
            value={quote.total}
            decimalPlaces={2}
            prefix={pricingCardCopy.currency}
            className="text-[1.875rem] font-medium leading-none tracking-[-0.03em]"
          />
        </div>

        <Button
          asChild
          className="mt-5 h-10 w-full rounded-lg bg-brand text-[0.75rem] font-medium text-brand-foreground hover:bg-brand-hover"
        >
          <Link href="/billing">
            {pricingCardCopy.get}{" "}
            <RollingNumber value={quote.quantity} />{" "}
            {pricingCardCopy.imagesLower}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        <p className="mt-3 text-center font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground/65">
          {pricingCardCopy.paymentNote}
        </p>
      </div>
    </div>
  );
}
