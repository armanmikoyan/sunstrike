"use client";

import { Textarea } from "@/ui/textarea";
import { cn } from "@/lib/utils";
import { ComposerAspectMenu } from "./composer-aspect-menu";
import { ComposerAttachMenu, ComposerAttachmentChip } from "./composer-attachment";
import { ComposerDurationMenu } from "./composer-duration-menu";
import { ComposerModeSwitch } from "./composer-mode-switch";
import { ComposerModelMenu } from "./composer-model-menu";
import { ComposerSubmit } from "./composer-submit";
import { composerCopy } from "./constants";
import { usePromptComposer } from "./hooks";

export function PromptComposer({ className }: { className?: string }) {
  const composer = usePromptComposer();
  const { prompt, setPrompt, submit } = composer;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn(
        "group/composer relative w-full rounded-[1.125rem] bg-[#17191c]/72 p-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_1.5rem_5rem_-2rem_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-brightness-[0.88] backdrop-saturate-[0.75] transition-[box-shadow,background-color] duration-300 focus-within:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1.75rem_5.625rem_-1.875rem_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      {/* Glass sheen: a soft top light over the frosted panel, under the
          content so it never washes out the prompt. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_42%,rgba(255,255,255,0)_72%)]"
      />

      <ComposerModeSwitch
        mode={composer.mode}
        cost={composer.cost}
        onSwitch={composer.switchMode}
      />

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
          className="min-h-[4.875rem] resize-none border-0 bg-transparent px-3 py-2 text-[0.875rem] leading-relaxed shadow-none placeholder:text-muted-foreground/65 focus-visible:ring-0 dark:bg-transparent"
          aria-label={composerCopy.promptLabel}
        />
        {prompt.length === 0 ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-3 top-2 text-[0.875rem] leading-relaxed text-muted-foreground/65"
          >
            {composer.typedPlaceholder}
            <span className="ml-0.5 inline-block h-[1.05em] w-px translate-y-[0.12em] animate-pulse bg-muted-foreground/60 motion-reduce:animate-none" />
          </span>
        ) : null}
      </div>

      <ComposerAttachmentChip composer={composer} />

      <div className="flex flex-wrap items-center gap-1 px-0.5 pb-0.5">
        <ComposerAttachMenu composer={composer} />
        <ComposerModelMenu composer={composer} />

        <span className="mx-0.5 h-3.5 w-px bg-white/[0.08]" />

        <ComposerAspectMenu composer={composer} />
        {composer.durationOptions.length > 0 ? (
          <ComposerDurationMenu composer={composer} />
        ) : (
          <span aria-hidden className="h-8 w-[3.5rem] shrink-0" />
        )}

        <ComposerSubmit />
      </div>
    </form>
  );
}
