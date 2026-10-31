"use client";

import { useState } from "react";
import { Film, Image as ImageIcon } from "lucide-react";
import { ImageOrderCard } from "@/components/pricing/image-order-card";
import { VideoOrderCard } from "@/components/pricing/video-order-card";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "video", label: "Video", icon: Film },
  { id: "image", label: "Images", icon: ImageIcon },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function PricingOrderTabs() {
  const [active, setActive] = useState<TabId>("video");

  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div
        role="tablist"
        aria-label="What do you want to make?"
        className="grid grid-cols-2 gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-0.5"
      >
        {tabs.map((tab) => {
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
                "flex h-8 items-center justify-center gap-1.5 rounded-[9px] text-[12px] font-medium transition-colors",
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
