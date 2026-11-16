"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "@/components/section-header";
import { AnimatedHeight } from "@/components/animated-height";
import { Button } from "@/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { formatUSD, formatUSDRate } from "@/lib/pricing";
import { instantTransition, layoutSpring } from "@/lib/motion";
import { imageRates, videoRates } from "@/mocks/pricing";
import { pricingCopy } from "./constants";

type ModelFilter = "all" | "video" | "image";

type ModelRow =
  | { kind: "video"; model: (typeof videoRates)[number] }
  | { kind: "image"; model: (typeof imageRates)[number] };

const filters: { value: ModelFilter; label: string }[] = [
  { value: "all", label: pricingCopy.rates.all },
  { value: "video", label: pricingCopy.rates.video },
  { value: "image", label: pricingCopy.rates.image },
];

const videoRows: ModelRow[] = videoRates.map((model) => ({
  kind: "video" as const,
  model,
}));

const imageRows: ModelRow[] = imageRates.map((model) => ({
  kind: "image" as const,
  model,
}));

const rows: ModelRow[] = videoRows.flatMap((row, index) => {
  const image = imageRows[index];
  return image ? [row, image] : [row];
});

function durationRange(durations: string[]) {
  if (durations.length === 0) return "";
  return `${durations[0]}–${durations[durations.length - 1]}`;
}

export function PricingModelRates() {
  const [filter, setFilter] = useState<ModelFilter>("all");
  const reduceMotion = useReducedMotion();
  const visible = rows.filter(
    (row) => filter === "all" || row.kind === filter,
  );
  const { rates } = pricingCopy;

  return (
    <section aria-label="Model rates">
      <SectionHeader
        title={
          <>
            {rates.titleBefore}
            <span className="font-serif italic text-brand">
              {rates.titleAccent}
            </span>
          </>
        }
        description={rates.description}
        action={
          <Button
            asChild
            variant="ghost"
            className="hidden h-8 rounded-lg px-2.5 text-[0.75rem] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground sm:flex"
          >
            <Link href="/create/video">
              {rates.action}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        }
      />

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as ModelFilter)}
        className="mt-5 w-fit"
      >
        <TabsList aria-label={rates.filterLabel} className="group-data-horizontal/tabs:h-7 gap-0 rounded-lg border border-white/[0.07] bg-white/[0.015] p-0.5">
          {filters.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="h-6 flex-none rounded-md px-2.5 text-[0.6875rem] font-medium text-muted-foreground group-data-[variant=default]/tabs-list:data-active:shadow-none data-active:bg-white/[0.08] data-active:text-foreground dark:data-active:border-transparent dark:data-active:bg-white/[0.08] dark:data-active:text-foreground"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className="hidden grid-cols-[1fr_14rem] border-b border-white/[0.06] bg-white/[0.015] px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground md:grid">
          <span>Model</span>
          <span className="text-right">Rate</span>
        </div>

        <AnimatedHeight>
          <div className="relative divide-y divide-white/[0.055]">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((row) => {
                const model = row.model;
                const isVideo = row.kind === "video";

                return (
                  <motion.div
                    key={`${row.kind}-${model.slug}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      transition: reduceMotion
                        ? instantTransition
                        : { duration: 0.1 },
                    }}
                    transition={reduceMotion ? instantTransition : layoutSpring}
                    className="grid gap-3 bg-card px-5 py-4 md:grid-cols-[1fr_14rem] md:items-start md:gap-6"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[0.9375rem] font-medium tracking-[-0.015em]">
                          {model.displayName}
                        </h3>
                        <span className="rounded-md border border-white/[0.1] px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-muted-foreground">
                          {isVideo ? rates.videoLabel : rates.imageLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.75rem] text-muted-foreground">
                        {model.summary}
                      </p>
                      <p className="mt-2 font-mono text-[0.6875rem] text-muted-foreground/80">
                        {model.capabilities.resolutions.join(" / ")}
                        {isVideo
                          ? ` · ${durationRange(model.capabilities.durations)} · ${
                              model.capabilities.audio ? rates.audio : rates.silent
                            }`
                          : " · image"}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="flex items-baseline gap-1.5 text-[1rem] font-medium tracking-[-0.02em] tabular-nums md:justify-end">
                        <span className="tabular-nums font-normal">
                          {row.kind === "video"
                            ? formatUSDRate(row.model.perSecond)
                            : formatUSD(row.model.perImage)}
                        </span>
                        <span className="text-[0.75rem] font-normal tracking-normal text-muted-foreground">
                          {isVideo ? rates.perSecond : rates.perImage}
                        </span>
                      </p>
                      {row.kind === "video" ? (
                        <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                          <span className="tabular-nums font-normal">{formatUSD(row.model.perSecond * 6)}</span> {rates.sixSecond}
                        </p>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </AnimatedHeight>
      </div>
    </section>
  );
}
