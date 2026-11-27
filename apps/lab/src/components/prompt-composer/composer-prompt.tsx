"use client";

import { Textarea } from "@/ui/textarea";
import { ComposerTypingHint } from "./composer-typing-hint";
import { COMPOSER_COPY } from "./constants";
import type { ComposerProps } from "./types";

export function ComposerPrompt({ composer: { prompt, setPrompt, submit, mode } }: ComposerProps) {
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
        className="min-h-19.5 resize-none border-0 bg-transparent px-3 py-2 text-sm lg:text-[0.8125rem] leading-relaxed shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-0 dark:bg-transparent"
        aria-label={COMPOSER_COPY.promptLabel}
      />
      {prompt.length === 0 ? <ComposerTypingHint mode={mode} /> : null}
    </div>
  );
}
