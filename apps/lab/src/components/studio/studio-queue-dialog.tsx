"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { STARTER_PROMPTS, STUDIO_COPY } from "./constants";
import { StudioCost } from "./studio-cost";
import type { StudioScopedProps } from "./types";

export function StudioQueueDialog({
  studio: { queued, setQueued, isVideo, cost, prompt, selectedModel, template, aspect, durationLabel, resolution },
}: StudioScopedProps) {
  const chips = [
    selectedModel.displayName,
    template?.name,
    aspect,
    resolution,
    isVideo ? durationLabel : STUDIO_COPY.preview.imageUnit,
  ].filter((chip): chip is string => Boolean(chip));

  return (
    <Dialog open={queued} onOpenChange={setQueued}>
      <DialogContent className="border-white/10 sm:max-w-100">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/4 text-muted-foreground">
            <Clock3 className="size-4" />
          </div>
          <DialogTitle className="text-base tracking-[-0.03em]">{STUDIO_COPY.queue.title}</DialogTitle>
          <DialogDescription className="text-xs lg:text-[0.6875rem] leading-relaxed">
            Your {isVideo ? "video" : "image"} is in the queue. This prototype holds the shot in the library while the
            real renderer is wired up.
            <StudioCost cost={cost} /> {STUDIO_COPY.queue.reserved}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-white/8 bg-white/1.5 p-3">
          <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{STUDIO_COPY.queue.recipe}</p>
          <p className="mt-1.5 line-clamp-2 text-xs lg:text-[0.6875rem] leading-relaxed text-foreground/75">
            {prompt || STARTER_PROMPTS[isVideo ? "video" : "image"]}
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
              <StudioCost cost={cost} />
            </span>
          </div>
        </div>
        <DialogFooter className="border-white/7 bg-white/1.5">
          <Button
            variant="outline"
            className="h-8 rounded-lg border-white/10 bg-transparent text-xs lg:text-[0.6875rem]"
            onClick={() => setQueued(false)}
          >
            {STUDIO_COPY.queue.keepDirecting}
          </Button>
          <Button asChild size="cta-xs">
            <Link href="/library">{STUDIO_COPY.queue.openLibrary}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
