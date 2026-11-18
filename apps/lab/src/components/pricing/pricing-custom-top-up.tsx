"use client";

import { PricingTopUpAmount } from "./pricing-top-up-amount";
import { PricingTopUpEstimate } from "./pricing-top-up-estimate";
import { PricingTopUpSummary } from "./pricing-top-up-summary";
import type { PricingCustomTopUpProps } from "./types";

export function PricingCustomTopUp({ videoModels, imageModels, amount, onAmountChange }: PricingCustomTopUpProps) {
  return (
    <article className="mt-3 grid gap-6 rounded-xl border border-white/8 bg-white/1.5 p-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_17rem] lg:items-center">
      <PricingTopUpSummary />
      <PricingTopUpAmount amount={amount} onAmountChange={onAmountChange} />
      <PricingTopUpEstimate videoModels={videoModels} imageModels={imageModels} amount={amount} />
    </article>
  );
}
