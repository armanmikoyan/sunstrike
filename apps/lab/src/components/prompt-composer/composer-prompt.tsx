"use client";

import { Textarea } from "@/ui/textarea";
import { COMPOSER_COPY } from "./constants";
import type { ComposerProps } from "./types";

export function ComposerPrompt({ composer: { prompt, setPrompt, submit, typedPlaceholder } }: ComposerProps) {
  return (
    <div className="relative">
      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        }}
        className="min-h-19.5 resize-none border-0 bg-transparent px-3 py-2 text-sm lg:text-[0.8125rem] leading-relaxed shadow-none placeholder:text-muted-foreground/65 focus-visible:ring-0 dark:bg-transparent"
        aria-label={COMPOSER_COPY.promptLabel}
      />
      {prompt.length === 0 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-2 text-sm lg:text-[0.8125rem] leading-relaxed text-muted-foreground/65"
        >
          {typedPlaceholder}
          <span className="ml-0.5 inline-block h-[1.05em] w-px translate-y-[0.12em] animate-pulse bg-muted-foreground/60 motion-reduce:animate-none" />
        </span>
      ) : null}
    </div>
  );
}
