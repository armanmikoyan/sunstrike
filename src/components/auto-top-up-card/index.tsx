"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
            <p className="text-[0.6875rem] font-medium">Auto top-up</p>
            <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
              {enabled ? "Refills at $5" : "Off"}
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
            Threshold
          </p>
          <p className="mt-1 font-mono text-[0.6875rem]">$5</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-black/15 px-2.5 py-2">
          <p className="text-[0.6875rem] text-muted-foreground">
            Pack
          </p>
          <p className="mt-1 font-mono text-[0.6875rem]">$10</p>
        </div>
      </div>
    </div>
  );
}
