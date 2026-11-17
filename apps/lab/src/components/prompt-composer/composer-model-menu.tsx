"use client";

import Link from "next/link";
import { ChevronDown, WandSparkles } from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { formatUSD } from "@/lib/pricing";
import { composerCopy } from "./constants";
import type { ComposerModelMenuProps } from "./types";

export function ComposerModelMenu({ composer }: ComposerModelMenuProps) {
  const { mode, model, setModel, activeModels } = composer;
  const modelCopy = composerCopy.modelLabels[mode];

  return (
    <div className="w-[10.75rem] shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 max-w-full gap-1.5 rounded-lg px-2 text-xs lg:text-[0.6875rem] font-medium text-foreground/80 hover:bg-white/5.5 hover:text-foreground"
          >
            <WandSparkles className="size-3 shrink-0 text-muted-foreground" />
            <span className="min-w-0 truncate" title={model}>
              {model}
            </span>
            <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[17.875rem] p-1">
          <DropdownMenuLabel className="flex items-center justify-between">{modelCopy}</DropdownMenuLabel>
          {activeModels.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onSelect={() => setModel(item.displayName)}
              className={cn(
                "items-start gap-2 px-2 py-1.5",
                model === item.displayName && "bg-white/8 text-foreground",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] font-medium">
                  {item.displayName}
                </span>
                <span className="mt-0.5 block text-xs lg:text-[0.6875rem] text-muted-foreground">
                  {item.provider} · <span className="tabular-nums font-normal">{formatUSD(item.cost)}</span>
                </span>
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="px-2 py-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
            <Link href="/pricing">{composerCopy.compareModels}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
