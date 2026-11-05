"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Switch } from "@/ui/switch";
import { cn } from "@/lib/utils";
import { autoTopUpCopy } from "./constants";

export function AutoTopUpCard() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-muted-foreground">
            <RefreshCw className="size-3.5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[0.6875rem] font-medium">
              {autoTopUpCopy.title}
            </p>
            <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
              {enabled ? autoTopUpCopy.enabled : autoTopUpCopy.disabled}
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
      <div
        className={cn(
          "mt-4 grid grid-cols-2 gap-2 transition-opacity",
          !enabled && "opacity-40",
        )}
      >
        <div className="rounded-lg border border-white/[0.06] bg-black/15 px-2.5 py-2">
          <p className="text-[0.6875rem] text-muted-foreground">
            {autoTopUpCopy.threshold}
          </p>
          <p className="mt-1 font-mono text-[0.6875rem]">
            {autoTopUpCopy.thresholdValue}
          </p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-black/15 px-2.5 py-2">
          <p className="text-[0.6875rem] text-muted-foreground">
            {autoTopUpCopy.pack}
          </p>
          <p className="mt-1 font-mono text-[0.6875rem]">
            {autoTopUpCopy.packValue}
          </p>
        </div>
      </div>
    </div>
  );
}
