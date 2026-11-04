"use client";

import { useState } from "react";
import { ImageOrderCard } from "./pricing-image-order-card";
import { VideoOrderCard } from "./pricing-video-order-card";
import { orderTabs, type OrderTabId } from "./constants";
import { cn } from "@/lib/utils";

export { ImageOrderCard } from "./pricing-image-order-card";
export { VideoOrderCard } from "./pricing-video-order-card";

export function PricingOrderTabs() {
  const [active, setActive] = useState<OrderTabId>("video");

  return (
    <div className="mx-auto w-full max-w-[23.75rem]">
      <div
        role="tablist"
        aria-label="What do you want to make?"
        className="grid grid-cols-2 gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-0.5"
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

      <div
        role="tabpanel"
        id={`order-panel-${active}`}
        aria-labelledby={`order-tab-${active}`}
        className="mt-2.5"
      >
        {active === "image" ? <ImageOrderCard /> : <VideoOrderCard />}
      </div>
    </div>
  );
}
