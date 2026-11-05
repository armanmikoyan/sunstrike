"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { formatUSD } from "@/lib/pricing";
import { starterPrompts, studioCopy } from "./constants";
import type { StudioQueueDialogProps } from "./types";

export function StudioQueueDialog({ studio }: StudioQueueDialogProps) {
  const copy = studioCopy.queue;
  const {
    queued,
    setQueued,
    isVideo,
    cost,
    prompt,
    selectedModel,
    aspect,
    duration,
  } = studio;

  const chips = [
    selectedModel.name,
    aspect,
    isVideo ? duration : studioCopy.preview.imageUnit,
    formatUSD(cost),
  ];

  return (
    <Dialog open={queued} onOpenChange={setQueued}>
      <DialogContent className="border-white/10 bg-[#1c1e20] sm:max-w-[25rem]">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-muted-foreground">
            <Clock3 className="size-4" />
          </div>
          <DialogTitle className="text-[1.125rem] tracking-[-0.03em]">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="text-[0.75rem] leading-relaxed">
            Your {isVideo ? "video" : "image"} is in the queue. This prototype
            holds the shot in the library while the real renderer is wired up.
            {formatUSD(cost)} {copy.reserved}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
          <p className="text-[0.6875rem] text-muted-foreground">
            {copy.recipe}
          </p>
          <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-relaxed text-foreground/75">
            {prompt || starterPrompts[isVideo ? "video" : "image"]}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded border border-white/[0.08] bg-black/20 px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <DialogFooter className="border-white/[0.07] bg-white/[0.015]">
          <Button
            variant="outline"
            className="h-8 rounded-lg border-white/10 bg-transparent text-[0.6875rem]"
            onClick={() => setQueued(false)}
          >
            {copy.keepDirecting}
          </Button>
          <Button
            asChild
            className="h-8 rounded-lg bg-brand px-3 text-[0.6875rem] text-brand-foreground hover:bg-brand-hover"
          >
            <Link href="/library">{copy.openLibrary}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
