"use client";

import { Paperclip, X } from "lucide-react";
import { COMPOSER_COPY } from "./constants";
import type { ComposerProps } from "./types";

export function ComposerAttachmentChip({ composer: { attachment, setAttachment } }: ComposerProps) {
  if (!attachment) return null;

  return (
    <div className="mx-2 mb-1.5 flex w-fit max-w-[calc(100%-1rem)] items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-2 py-1.5">
      <Paperclip className="size-3 shrink-0 text-muted-foreground" />
      <span className="truncate text-xs lg:text-[0.6875rem] text-foreground">{attachment}</span>
      <button
        type="button"
        onClick={() => setAttachment(null)}
        className="text-muted-foreground transition-colors hover:text-foreground"
        aria-label={COMPOSER_COPY.attach.remove}
      >
        <X className="size-3" />
      </button>
    </div>
  );
}
