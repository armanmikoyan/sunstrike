import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Zap } from "lucide-react";
import { ClipStrip } from "@/components/clip-strip";
import { Button } from "@/ui/button";
import { generationRates, topUpPacks } from "@/mocks/pricing";
import { cn } from "@/lib/utils";
import {
  pricingClipIds,
  pricingCopy,
  pricingIntro,
  pricingPoints,
} from "./constants";
import { PricingFaq } from "./pricing-faq";
import { PricingOrderTabs } from "./pricing-order-tabs";

export function Pricing() {
  const { hero, topUps, rates, faq } = pricingCopy;

  return (
    <>
      <div className="w-full px-5 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_22.5rem]">
          <div className="flex flex-col gap-8">
            <div>
              <div className="text-[0.75rem] text-muted-foreground">
                {hero.eyebrow}
              </div>
              <h1 className="mt-4 max-w-[43.75rem] text-balance text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.02] tracking-[-0.05em]">
                {hero.title}
                <br />
                <span className="font-display font-normal tracking-[-0.03em]">
                  {hero.titleAccent}
                </span>
              </h1>
              <p className="mt-4 max-w-[31.875rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {pricingIntro.map((segment) => (
                  <span
                    key={segment.text}
                    className={segment.emphasis ? "text-foreground" : undefined}
                  >
                    {segment.text}
                  </span>
                ))}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {pricingPoints.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground"
                  >
                    <Check className="size-3.5 text-muted-foreground" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <ClipStrip
              ids={pricingClipIds}
              className="hidden min-h-[12.5rem] flex-1 lg:flex"
            />
          </div>

          <PricingOrderTabs />
        </div>

        <div className="mt-16">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-[1.375rem] font-medium tracking-[-0.025em]">
                {topUps.title}
              </h2>
              <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                {topUps.description}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              {topUps.secure}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {topUpPacks.map((pack) => (
              <div
                key={pack.id}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-xl border p-5",
                  pack.popular
                    ? "border-white/[0.16] bg-white/[0.03]"
                    : "border-white/[0.08] bg-white/[0.015]",
                )}
              >
                {pack.popular ? (
                  <span className="absolute right-5 top-5 text-[0.6875rem] font-medium text-foreground">
                    {topUps.popular}
                  </span>
                ) : null}
                <p className="text-[0.75rem] font-medium text-muted-foreground">
                  {pack.name}
                </p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-[2.25rem] font-medium leading-none tracking-[-0.03em] tabular-nums">
                    {topUps.currency}
                    {pack.price}
                  </span>
                  <span className="mb-1 text-[0.75rem] text-muted-foreground">
                    {topUps.oneTime}
                  </span>
                </div>
                <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                  {pack.note}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[0.6875rem] text-muted-foreground">
                  <span>{topUps.balance}</span>
                  <span>{topUps.neverExpires}</span>
                </div>
                <Button
                  asChild
                  variant={pack.popular ? "default" : "outline"}
                  className={cn(
                    "mt-5 h-10 rounded-lg text-[0.75rem] font-medium",
                    pack.popular
                      ? "bg-brand text-brand-foreground hover:bg-brand-hover"
                      : "border-white/10 bg-transparent text-foreground hover:bg-white/[0.04]",
                  )}
                >
                  <Link href="/billing">
                    {topUps.topUp}
                    {pack.price}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <h2 className="text-[0.9375rem] font-medium">
                  {rates.title}
                </h2>
                <p className="mt-1 text-[0.75rem] text-muted-foreground">
                  {rates.description}
                </p>
              </div>
              <Zap className="size-4 text-muted-foreground" />
            </div>
            <div className="divide-y divide-white/[0.055]">
              {generationRates.map((rate) => (
                <div
                  key={rate.name}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] font-medium">{rate.name}</p>
                    <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                      {rate.detail}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-baseline gap-2">
                    <span className="font-mono text-[0.9375rem] font-medium text-foreground">
                      {rate.price}
                    </span>
                    <span className="hidden text-[0.6875rem] text-muted-foreground min-[22.5rem]:inline">
                      {rates.perRender}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.015] px-5 py-3">
              <p className="text-[0.6875rem] text-muted-foreground">
                {rates.refundNote}
              </p>
              <Link
                href="/create/video"
                className="flex items-center gap-1 text-[0.6875rem] font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {rates.action}
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <h2 className="text-[1.375rem] font-medium tracking-[-0.025em]">
            {faq.title}
          </h2>
          <PricingFaq />
        </div>
      </div>
    </>
  );
}
