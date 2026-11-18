"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SegmentedTabs } from "@/ui/segmented-tabs";
import { RollingNumber } from "@/motion/rolling-number";
import { Button } from "@/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { formatUSDRate, modelCapacity } from "@/components/pricing/utils";
import { PRICING_COPY, TOP_UP_MODES } from "./constants";
import type { GenerationKind, PricingTopUpEstimateProps } from "./types";

/** Model picker and capacity estimate for the custom amount. */
export function PricingTopUpEstimate({ videoModels, imageModels, amount }: PricingTopUpEstimateProps) {
  const router = useRouter();
  const [mode, setMode] = useState<GenerationKind>("video");
  const [videoSlug, setVideoSlug] = useState(videoModels[0]?.slug ?? "");
  const [imageSlug, setImageSlug] = useState(imageModels[0]?.slug ?? "");

  const models = mode === "video" ? videoModels : imageModels;
  const activeSlug = mode === "video" ? videoSlug : imageSlug;
  const selectedModel = models.find((model) => model.slug === activeSlug) ?? models[0];
  const rate = selectedModel ? (mode === "video" ? (selectedModel.perSecond ?? 0) : (selectedModel.perImage ?? 0)) : 0;
  const capacity = modelCapacity(selectedModel, mode, amount, PRICING_COPY.topUps.custom.videoSeconds);
  const unit = mode === "video" ? PRICING_COPY.topUps.videos : PRICING_COPY.topUps.images;

  return (
    <div className="flex flex-col gap-4 border-t border-white/7 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
      <div>
        <p className="text-sm lg:text-xs font-medium">{PRICING_COPY.topUps.custom.calculatorTitle}</p>
        <p className="mt-1 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
          {PRICING_COPY.topUps.custom.calculatorDescription}
        </p>
      </div>

      <div className="rounded-lg border border-white/8 bg-white/2 p-3">
        <SegmentedTabs
          value={mode}
          onValueChange={setMode}
          options={TOP_UP_MODES}
          ariaLabel={PRICING_COPY.topUps.custom.modeLabel}
          fullWidth
          className="w-full gap-0"
        />

        <label htmlFor="custom-top-up-model" className="mt-3 block text-xs lg:text-[0.6875rem] text-muted-foreground">
          {PRICING_COPY.topUps.custom.modelLabel}
        </label>
        <Select
          value={selectedModel?.slug ?? ""}
          onValueChange={(value) => {
            if (mode === "video") {
              setVideoSlug(value);
            } else {
              setImageSlug(value);
            }
          }}
        >
          <SelectTrigger
            id="custom-top-up-model"
            className="mt-1.5 w-full border-white/10 bg-white/3.5 text-foreground hover:border-white/20 focus-visible:border-white/20 focus-visible:ring-0 dark:bg-white/3.5 dark:hover:bg-white/5"
          >
            <SelectValue>{selectedModel?.displayName}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.slug} value={model.slug}>
                {model.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-3 border-t border-white/7 pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">
              {PRICING_COPY.topUps.custom.estimateLabel}
            </p>
            <p className="text-[0.9375rem] font-medium leading-none tracking-[-0.02em] tabular-nums">
              <RollingNumber value={capacity} />
              <span className="ml-1 text-xs lg:text-[0.6875rem] font-normal tracking-normal text-muted-foreground">
                {unit}
              </span>
            </p>
          </div>
          <p className="mt-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
            <span className="tabular-nums">{formatUSDRate(rate)}</span>{" "}
            {mode === "video"
              ? `${PRICING_COPY.rates.perSecond} · ${PRICING_COPY.topUps.custom.videoSeconds}s each`
              : PRICING_COPY.rates.perImage}
          </p>
        </div>
      </div>

      <Button type="button" size="cta" onClick={() => router.push("/settings/billing")} className="w-full">
        {PRICING_COPY.topUps.custom.topUp}{" "}
        <RollingNumber value={amount} useGrouping prefix={PRICING_COPY.topUps.currency} />
        <ArrowRight className="size-3.5" />
      </Button>
    </div>
  );
}
