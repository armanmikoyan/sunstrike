"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { formatUSD } from "@/lib/pricing";
import { starterPrompts, studioCopy } from "./constants";
import type { StudioQueueDialogProps } from "./types";

export function StudioQueueDialog({ studio }: StudioQueueDialogProps) {
  const copy = studioCopy.queue;
  const { queued, setQueued, isVideo, cost, prompt, selectedModel, template, aspect, duration, resolution } = studio;

  const chips = [
    selectedModel.displayName,
    template?.name,
    aspect,
    resolution,
    isVideo ? duration : studioCopy.preview.imageUnit,
  ].filter((chip): chip is string => Boolean(chip));

  return (
    <Dialog open={queued} onOpenChange={setQueued}>
      <DialogContent className="border-white/10 sm:max-w-[25rem]">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/4 text-muted-foreground">
            <Clock3 className="size-4" />
          </div>
          <DialogTitle className="text-[1rem] tracking-[-0.03em]">{copy.title}</DialogTitle>
          <DialogDescription className="text-xs lg:text-[0.6875rem] leading-relaxed">
            Your {isVideo ? "video" : "image"} is in the queue. This prototype holds the shot in the library while the
            real renderer is wired up.
            <span className="tabular-nums font-normal">{formatUSD(cost)}</span> {copy.reserved}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-white/8 bg-white/1.5 p-3">
          <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{copy.recipe}</p>
          <p className="mt-1.5 line-clamp-2 text-xs lg:text-[0.6875rem] leading-relaxed text-foreground/75">
            {prompt || starterPrompts[isVideo ? "video" : "image"]}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded border border-white/8 bg-black/20 px-1.5 py-0.5 font-mono text-xs lg:text-[0.6875rem] text-muted-foreground"
              >
                {chip}
              </span>
            ))}
            <span className="rounded border border-white/8 bg-black/20 px-1.5 py-0.5 font-mono text-xs lg:text-[0.6875rem] text-muted-foreground">
              <span className="tabular-nums font-normal">{formatUSD(cost)}</span>
            </span>
          </div>
        </div>
        <DialogFooter className="border-white/7 bg-white/1.5">
          <Button
            variant="outline"
            className="h-8 rounded-lg border-white/10 bg-transparent text-xs lg:text-[0.6875rem]"
            onClick={() => setQueued(false)}
          >
            {copy.keepDirecting}
          </Button>
          <Button
            asChild
            className="h-8 rounded-lg bg-brand px-3 text-xs lg:text-[0.6875rem] text-brand-foreground hover:bg-brand-hover"
          >
            <Link href="/library">{copy.openLibrary}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
