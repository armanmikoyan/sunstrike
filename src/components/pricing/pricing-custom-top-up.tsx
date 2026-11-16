"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { RollingNumber } from "@/components/rolling-number";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { formatUSDRate } from "@/lib/pricing";
import { pricingCopy } from "./constants";
import { QuantityButton } from "./pricing-quantity-button";
import { SegmentedSlider } from "./segmented-slider";

type PricingModel = {
  slug: string;
  displayName: string;
  perSecond?: number;
  perImage?: number;
};

type PricingCustomTopUpProps = {
  videoModels: PricingModel[];
  imageModels: PricingModel[];
  amount: number;
  onAmountChange: (amount: number) => void;
};

function amountLabel(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function modelCapacity(
  model: PricingModel | undefined,
  mode: "video" | "image",
  amount: number,
  videoSeconds: number,
) {
  const rate = model
    ? mode === "video"
      ? (model.perSecond ?? 0)
      : (model.perImage ?? 0)
    : 0;
  if (rate <= 0) return 0;
  return mode === "video"
    ? Math.floor(amount / (rate * videoSeconds))
    : Math.floor(amount / rate);
}

export function PricingCustomTopUp({
  videoModels,
  imageModels,
  amount,
  onAmountChange: setAmount,
}: PricingCustomTopUpProps) {
  const router = useRouter();
  const { custom } = pricingCopy.topUps;
  const [mode, setMode] = useState<"video" | "image">("video");
  const [videoSlug, setVideoSlug] = useState(videoModels[0]?.slug ?? "");
  const [imageSlug, setImageSlug] = useState(imageModels[0]?.slug ?? "");

  const models = mode === "video" ? videoModels : imageModels;
  const activeSlug = mode === "video" ? videoSlug : imageSlug;
  const selectedModel =
    models.find((model) => model.slug === activeSlug) ?? models[0];
  const rate = selectedModel
    ? mode === "video"
      ? (selectedModel.perSecond ?? 0)
      : (selectedModel.perImage ?? 0)
    : 0;
  const capacity = modelCapacity(selectedModel, mode, amount, custom.videoSeconds);
  const unit =
    mode === "video" ? pricingCopy.topUps.videos : pricingCopy.topUps.images;
  const changeAmount = (direction: -1 | 1) => {
    setAmount(
      Math.min(
        custom.max,
        Math.max(custom.min, amount + direction * custom.step),
      ),
    );
  };

  return (
    <article className="mt-3 grid gap-6 rounded-xl border border-white/[0.08] bg-white/[0.015] p-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_17rem] lg:items-center">
      <div>
        <p className="text-xs lg:text-[0.6875rem] font-medium">{custom.name}</p>
        <p className="mt-1 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
          {custom.description}
        </p>
        <p className="mt-3 text-xs lg:text-[0.6875rem] text-muted-foreground">
          {custom.minMax}
        </p>
      </div>

      <div className="min-w-0 border-t border-white/[0.07] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <div className="flex items-center justify-between gap-3">
          <RollingNumber
            value={amount}
            useGrouping
            prefix={pricingCopy.topUps.currency}
            className="text-[2rem] font-normal leading-none tracking-[-0.03em]"
          />
          <div className="flex items-center gap-2">
            <QuantityButton
              onClick={() => changeAmount(-1)}
              disabled={amount <= custom.min}
              aria-label={custom.decreaseAmount}
            >
              −
            </QuantityButton>
            <QuantityButton
              onClick={() => changeAmount(1)}
              disabled={amount >= custom.max}
              aria-label={custom.increaseAmount}
            >
              +
            </QuantityButton>
          </div>
        </div>

        <SegmentedSlider
          value={amount}
          min={custom.min}
          max={custom.max}
          step={custom.step}
          onValueChange={setAmount}
          label={custom.amountLabel}
          className="mt-4"
        />
        <div className="mt-2 flex justify-between text-xs lg:text-[0.6875rem] font-normal tracking-normal text-muted-foreground">
          <span>{amountLabel(custom.min)}</span>
          <span>{amountLabel(custom.max)}</span>
        </div>

      </div>

      <div className="flex flex-col gap-4 border-t border-white/[0.07] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <div>
          <p className="text-sm lg:text-[0.75rem] font-medium">
            {custom.calculatorTitle}
          </p>
          <p className="mt-1 text-xs lg:text-[0.6875rem] leading-relaxed text-muted-foreground">
            {custom.calculatorDescription}
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as "video" | "image")}
            className="w-full gap-0"
          >
            <TabsList
              aria-label={custom.modeLabel}
              className="grid w-full grid-cols-2 gap-0 rounded-lg border border-white/[0.06] bg-white/[0.025] p-0.5 group-data-horizontal/tabs:h-9 lg:group-data-horizontal/tabs:h-7"
            >
              <TabsTrigger
                value="video"
                className="rounded-[0.625rem] text-sm font-medium text-muted-foreground data-active:bg-white/[0.08] data-active:text-foreground data-active:shadow-none lg:text-[0.6875rem] dark:data-active:border-transparent dark:data-active:bg-white/[0.08]"
              >
                {custom.video}
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="rounded-[0.625rem] text-sm font-medium text-muted-foreground data-active:bg-white/[0.08] data-active:text-foreground data-active:shadow-none lg:text-[0.6875rem] dark:data-active:border-transparent dark:data-active:bg-white/[0.08]"
              >
                {custom.image}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <label
            htmlFor="custom-top-up-model"
            className="mt-3 block text-xs lg:text-[0.6875rem] text-muted-foreground"
          >
            {custom.modelLabel}
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
              className="mt-1.5 h-9 w-full rounded-lg border-white/[0.1] bg-white/[0.035] px-3 text-xs lg:text-[0.6875rem] text-foreground hover:border-white/20 focus-visible:border-white/20 focus-visible:ring-0 dark:bg-white/[0.035] dark:hover:bg-white/[0.05]"
            >
              <SelectValue>{selectedModel?.displayName}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem
                  key={model.slug}
                  value={model.slug}
                  className="py-1.5 text-xs lg:text-[0.6875rem]"
                >
                  {model.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-3 border-t border-white/[0.07] pt-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">
                {custom.estimateLabel}
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
                ? `${pricingCopy.rates.perSecond} · ${custom.videoSeconds}s each`
                : pricingCopy.rates.perImage}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/settings/billing")}
          className="h-10 w-full rounded-lg bg-brand text-xs lg:text-[0.6875rem] font-medium text-brand-foreground hover:bg-brand-hover"
        >
          {custom.topUp}{" "}
          <RollingNumber
            value={amount}
            useGrouping
            prefix={pricingCopy.topUps.currency}
          />
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </article>
  );
}
