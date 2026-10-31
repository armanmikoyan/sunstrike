"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RollingNumber } from "@/components/magicui/rolling-number";
import { QuantityButton, pricingSliderStyles } from "@/components/pricing/quantity-button";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  MAX_CLIPS,
  MIN_CLIPS,
  formatUSD,
  getVideoQuote,
  videoModels,
  type VideoModelId,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function VideoOrderCard() {
  const [quantity, setQuantity] = useState(4);
  const [model, setModel] = useState<VideoModelId>("standard");
  const quote = getVideoQuote(quantity, model);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-[#1c1e20]">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground">Your order</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            PAYG
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Clips
            </p>
            <div className="mt-1 flex items-end gap-2">
              <RollingNumber
                value={quote.quantity}
                className="text-[34px] font-medium leading-none tracking-[-0.03em]"
              />
              <span className="pb-1 text-[12px] text-muted-foreground">
                clips
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <QuantityButton
              onClick={() =>
                setQuantity((value) => Math.max(MIN_CLIPS, value - 1))
              }
              disabled={quantity <= MIN_CLIPS}
              aria-label="Decrease clips"
            >
              −
            </QuantityButton>
            <QuantityButton
              onClick={() =>
                setQuantity((value) => Math.min(MAX_CLIPS, value + 1))
              }
              disabled={quantity >= MAX_CLIPS}
              aria-label="Increase clips"
            >
              +
            </QuantityButton>
          </div>
        </div>

        <Slider
          value={[quantity]}
          min={MIN_CLIPS}
          max={MAX_CLIPS}
          step={1}
          onValueChange={([value]) => setQuantity(value)}
          aria-label="Number of clips"
          className={cn("mt-5 w-full", pricingSliderStyles)}
        />
        <div className="mt-2 flex justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70">
          <span>1 clip</span>
          <span>50 clips</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
          {videoModels.map((item) => {
            const active = item.id === model;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setModel(item.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-xl border p-2.5 text-left transition-colors",
                  active
                    ? "border-support/40 bg-support/10 hover:border-support/55 hover:bg-support/15"
                    : "border-white/[0.1] hover:border-white/25 hover:bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.1em]",
                    active ? "text-support" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </span>
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  {item.detail}
                </span>
                <span className="mt-1.5 flex flex-wrap items-baseline gap-x-1 text-[13px] font-medium tracking-[-0.02em] text-foreground">
                  {formatUSD(item.price)}
                  <span className="text-[11px] font-normal text-muted-foreground">
                    / clip
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-4 text-[12px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Clips</span>
            <RollingNumber value={quote.quantity} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Per clip</span>
            <RollingNumber value={quote.unit} decimalPlaces={2} prefix="$" />
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-white/[0.07] pt-4">
          <span className="text-[13px] text-muted-foreground">Total</span>
          <RollingNumber
            value={quote.total}
            decimalPlaces={2}
            prefix="$"
            className="text-[30px] font-medium leading-none tracking-[-0.03em]"
          />
        </div>

        <Button
          asChild
          className="mt-5 h-10 w-full rounded-lg bg-brand text-[12px] font-medium text-brand-foreground hover:bg-brand-hover"
        >
          <Link href="/billing">
            Get <RollingNumber value={quote.quantity} /> clips
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/65">
          One-time payment · No subscription
        </p>
      </div>
    </div>
  );
}
