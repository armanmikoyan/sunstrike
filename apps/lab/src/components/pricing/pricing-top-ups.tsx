"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { topUpPacks } from "@/mocks/pricing";
import { PRICING_COPY } from "./constants";
import { PricingCustomTopUp } from "./pricing-custom-top-up";
import { PricingTopUpPacks } from "./pricing-top-up-packs";
import type { PricingTopUpsProps } from "./types";

export function PricingTopUps({ videoModels, imageModels }: PricingTopUpsProps) {
  const popular = topUpPacks.find((pack) => pack.popular) ?? topUpPacks[0];
  const [amount, setAmount] = useState(popular.price);

  return (
    <>
      <SectionHeader
        title={PRICING_COPY.topUps.title}
        description={PRICING_COPY.topUps.description}
        action={
          <span className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            {PRICING_COPY.topUps.secure}
          </span>
        }
      />

      <PricingTopUpPacks amount={amount} onSelect={setAmount} />

      <p className="mt-2.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
        {PRICING_COPY.topUps.balance} · {PRICING_COPY.topUps.neverExpires}
      </p>

      <PricingCustomTopUp
        videoModels={videoModels}
        imageModels={imageModels}
        amount={amount}
        onAmountChange={setAmount}
      />

      <p className="mt-3 text-xs lg:text-[0.6875rem] text-muted-foreground">{PRICING_COPY.topUps.capacityNote}</p>
    </>
  );
}
