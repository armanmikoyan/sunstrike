"use client";

import Link from "next/link";
import { Check, ChevronDown, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { PromptComposerState } from "./hooks";

export function ComposerModelMenu({
  composer,
}: {
  composer: PromptComposerState;
}) {
  const { mode, model, setModel, activeModels } = composer;

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
          {mode === "video" ? "Motion model" : "Image model"}
          <span className="text-[0.6875rem] font-normal text-muted-foreground">
            {mode === "video" ? "Motion" : "Image"}
          </span>
        </DropdownMenuLabel>
        {activeModels.map((item) => (
          <DropdownMenuItem
            key={item.name}
            onSelect={() => setModel(item.name)}
            className="items-start gap-2 p-2"
          >
            <span
              className={cn(
                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-white/[0.07] bg-white/[0.03]",
                model === item.name &&
                  "border-white/20 bg-white/[0.08] text-foreground",
              )}
            >
              {model === item.name ? <Check className="size-3.5" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[0.75rem] font-medium">
                {item.name}
                <span className="rounded bg-white/[0.055] px-1.5 py-0.5 text-[0.6875rem] font-normal text-muted-foreground">
                  {item.tag}
                </span>
              </span>
              <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
                {item.description} · {formatUSD(item.cost)}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="p-2 text-[0.6875rem] text-muted-foreground"
        >
          <Link href="/pricing">Compare models and rates</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
