"use client";

import Link from "next/link";
import { ChevronDown, WandSparkles } from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { formatUSD } from "@/components/pricing/utils";
import { COMPOSER_COPY } from "./constants";
import type { ComposerProps } from "./types";

export function ComposerModelMenu({ composer: { mode, model, setModel, activeModels } }: ComposerProps) {
  const modelCopy = COMPOSER_COPY.modelLabels[mode];

  return (
    <div className="w-43 shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="max-w-full gap-1.5 font-medium text-foreground/80 hover:bg-white/5.5 hover:text-foreground"
          >
            <WandSparkles className="size-3 shrink-0 text-muted-foreground" />
            <span className="min-w-0 truncate" title={model}>
              {model}
            </span>
            <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-71.5 p-1">
          <DropdownMenuLabel className="flex items-center justify-between">{modelCopy}</DropdownMenuLabel>
          {activeModels.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onSelect={() => setModel(item.displayName)}
              className={cn("items-start gap-2", model === item.displayName && "bg-white/8 text-foreground")}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-medium">{item.displayName}</span>
                <span className="mt-0.5 block text-muted-foreground">
                  {item.provider} · <span className="tabular-nums font-normal">{formatUSD(item.cost)}</span>
                </span>
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="text-muted-foreground">
            <Link href="/pricing">{COMPOSER_COPY.compareModels}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
