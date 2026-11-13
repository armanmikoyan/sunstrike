"use client";

import { useState } from "react";
import { ImageOrderCard } from "./pricing-image-order-card";
import { VideoOrderCard } from "./pricing-video-order-card";
import { orderTabs, pricingCardCopy, type OrderTabId } from "./constants";
import { cn } from "@/lib/utils";

export { ImageOrderCard } from "./pricing-image-order-card";
export { VideoOrderCard } from "./pricing-video-order-card";

export function PricingOrderTabs() {
  const [active, setActive] = useState<OrderTabId>("video");

  return (
    <div className="mx-auto w-full max-w-[23.75rem]">
      <div
        role="tablist"
        aria-label={pricingCardCopy.orderTabsLabel}
        className="grid grid-cols-2 gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.015] p-0.5"
      >
        {orderTabs.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`order-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`order-panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex h-8 items-center justify-center gap-1.5 rounded-[0.5625rem] text-[0.75rem] font-medium transition-colors",
                selected
                  ? "bg-white/[0.075] text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Both cards share one grid cell so the taller one reserves the space.
          Switching tabs only crossfades; the page below never shifts. */}
      <div className="mt-2.5 grid">
        {orderTabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <div
              key={tab.id}
              id={`order-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`order-tab-${tab.id}`}
              aria-hidden={!selected}
              inert={!selected}
              className={cn(
                "col-start-1 row-start-1 transition-opacity ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                selected
                  ? "opacity-100 duration-200"
                  : "pointer-events-none opacity-0 duration-0",
              )}
            >
              {tab.id === "image" ? <ImageOrderCard /> : <VideoOrderCard />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
