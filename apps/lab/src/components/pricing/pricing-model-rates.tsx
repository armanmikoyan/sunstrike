"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "@/components/section-header";
import { SegmentedTabs } from "@/ui/segmented-tabs";
import { AnimatedHeight } from "@/motion/animated-height";
import { Button } from "@/ui/button";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { MODEL_FILTERS, PRICING_COPY, RATE_SKELETON_ROWS } from "./constants";
import { usePricingModels } from "./hooks";
import { PricingModelRow } from "./pricing-model-row";
import { PricingModelRowSkeleton } from "./pricing-model-row-skeleton";
import type { ModelFilter } from "./types";
import { interleaveRows, rowsFor } from "./utils";

export function PricingModelRates() {
  const [filter, setFilter] = useState<ModelFilter>("all");
  const reduceMotion = useReducedMotion();
  const { status, videoModels, imageModels } = usePricingModels();
  const visible = rowsFor(interleaveRows(videoModels, imageModels), filter);

  return (
    <section aria-label="Model rates">
      <SectionHeader
        title={
          <>
            {PRICING_COPY.rates.titleBefore}
            {PRICING_COPY.rates.titleAccent}
          </>
        }
        description={PRICING_COPY.rates.description}
        action={
          <Button asChild variant="quiet" className="hidden sm:flex">
            <Link href="/create/video">
              {PRICING_COPY.rates.action}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        }
      />

      <SegmentedTabs
        value={filter}
        onValueChange={setFilter}
        options={MODEL_FILTERS}
        ariaLabel={PRICING_COPY.rates.filterLabel}
        scrollable
        className="mt-5 w-full"
      />

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
        <div className="hidden grid-cols-[1fr_14rem] border-b border-white/6 bg-white/1.5 px-5 py-3 font-mono text-xs lg:text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground md:grid">
          <span>Model</span>
          <span className="text-right">Rate</span>
        </div>

        {status === "loading" ? (
          <div
            role="status"
            aria-label={PRICING_COPY.rates.loading}
            className="animate-pulse divide-y divide-white/5.5"
          >
            {Array.from({ length: RATE_SKELETON_ROWS }, (_, index) => (
              <PricingModelRowSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {status === "failed" ? (
          <p role="status" className="bg-card px-5 py-6 text-xs lg:text-[0.6875rem] text-muted-foreground">
            {PRICING_COPY.rates.unavailable}
          </p>
        ) : null}

        <AnimatedHeight>
          <div className="relative divide-y divide-white/5.5">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((row) => (
                <motion.div
                  key={`${row.kind}-${row.model.slug}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: reduceMotion ? INSTANT_TRANSITION : { duration: 0.1 },
                  }}
                  transition={reduceMotion ? INSTANT_TRANSITION : LAYOUT_SPRING}
                  className="grid gap-3 bg-card px-5 py-4 md:grid-cols-[1fr_14rem] md:items-start md:gap-6"
                >
                  <PricingModelRow row={row} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </AnimatedHeight>
      </div>
    </section>
  );
}
