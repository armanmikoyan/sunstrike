"use client";

import { ComposerAspectMenu } from "./composer-aspect-menu";
import { ComposerAttachMenu } from "./composer-attach-menu";
import { ComposerDurationMenu } from "./composer-duration-menu";
import { ComposerModelMenu } from "./composer-model-menu";
import { ComposerSubmit } from "./composer-submit";
import type { ComposerProps } from "./types";

/**
 * Phones stack the bar into two rows — attachment and model on top, ratio,
 * duration and submit below. From sm up the groups dissolve and every control
 * sits on one line, with the submit at the right end.
 */
export function ComposerToolbar({ composer }: ComposerProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 px-0.5 pb-0.5">
      <div className="flex w-full min-w-0 items-center gap-1 sm:contents">
        <ComposerAttachMenu composer={composer} />
        <ComposerModelMenu composer={composer} />
      </div>

      <div className="flex w-full items-center gap-1 sm:contents">
        <span className="mx-0.5 hidden h-3.5 w-px bg-white/8 sm:block" />
        <ComposerAspectMenu composer={composer} />
        {composer.durationOptions.length > 0 ? (
          <ComposerDurationMenu composer={composer} />
        ) : (
          <span aria-hidden className="h-9 w-14 shrink-0" />
        )}
        <ComposerSubmit />
      </div>
    </div>
  );
}
