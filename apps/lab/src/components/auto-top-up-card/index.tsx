"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { IconBox } from "@/ui/icon-box";
import { Switch } from "@/ui/switch";
import { cn } from "cn";
import { AUTO_TOP_UP_COPY } from "./constants";

export function AutoTopUpCard() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="rounded-xl border border-white/8 bg-white/1.5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <IconBox>
            <RefreshCw className="size-3.5" strokeWidth={1.8} />
          </IconBox>
          <div>
            <p className="text-xs lg:text-[0.6875rem] font-medium">{AUTO_TOP_UP_COPY.title}</p>
            <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
              {enabled ? (
                <>
                  {AUTO_TOP_UP_COPY.enabled} <span className="tabular-nums font-normal">$5</span>
                </>
              ) : (
                AUTO_TOP_UP_COPY.disabled
              )}
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
      <div className={cn("mt-4 grid grid-cols-2 gap-2 transition-opacity", !enabled && "opacity-40")}>
        <div className="rounded-lg border border-white/6 bg-black/15 px-2.5 py-2">
          <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{AUTO_TOP_UP_COPY.threshold}</p>
          <p className="mt-1 font-mono text-xs lg:text-[0.6875rem]">
            <span className="tabular-nums font-normal">{AUTO_TOP_UP_COPY.thresholdValue}</span>
          </p>
        </div>
        <div className="rounded-lg border border-white/6 bg-black/15 px-2.5 py-2">
          <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{AUTO_TOP_UP_COPY.pack}</p>
          <p className="mt-1 font-mono text-xs lg:text-[0.6875rem]">
            <span className="tabular-nums font-normal">{AUTO_TOP_UP_COPY.packValue}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
