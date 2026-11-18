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
import { MODEL_FILTERS, PRICING_COPY, ROWS } from "./constants";
import { PricingModelRow } from "./pricing-model-row";
import type { ModelFilter } from "./types";

export function PricingModelRates() {
  const [filter, setFilter] = useState<ModelFilter>("all");
  const reduceMotion = useReducedMotion();
  const visible = ROWS.filter((row) => filter === "all" || row.kind === filter);

  return (
    <section aria-label="Model rates">
      <SectionHeader
        title={
          <>
            {PRICING_COPY.rates.titleBefore}
            <span className="font-serif italic text-brand">{PRICING_COPY.rates.titleAccent}</span>
          </>
        }
        description={PRICING_COPY.rates.description}
        action={
          <Button
            asChild
            variant="ghost"
            className="hidden h-8 rounded-lg px-2.5 text-xs lg:text-[0.6875rem] text-muted-foreground hover:bg-white/4 hover:text-foreground sm:flex"
          >
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
