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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 rounded-lg px-2 text-[0.6875rem] font-medium text-foreground/80 hover:bg-white/[0.055] hover:text-foreground"
        >
          <WandSparkles className="size-3 text-muted-foreground" />
          <span className="max-w-[6.25rem] truncate sm:max-w-none">
            {model}
          </span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[17.875rem] p-1.5">
        <DropdownMenuLabel className="flex items-center justify-between">
          {modelCopy}
        </DropdownMenuLabel>
        {activeModels.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onSelect={() => setModel(item.displayName)}
            className={cn(
              "items-start gap-2 p-2",
              model === item.displayName && "bg-white/[0.08] text-foreground",
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[0.75rem] font-medium">
                {item.displayName}
              </span>
              <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
                {item.provider} · {formatUSD(item.cost)}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="p-2 text-[0.6875rem] text-muted-foreground"
        >
          <Link href="/pricing">{composerCopy.compareModels}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
