"use client";

import { cn } from "cn";
import type { PromptComposerProps } from "./types";
import { ComposerAttachmentChip } from "./composer-attachment-chip";
import { ComposerModeSwitch } from "./composer-mode-switch";
import { ComposerPrompt } from "./composer-prompt";
import { ComposerToolbar } from "./composer-toolbar";
import { usePromptComposer } from "./hooks";

export function PromptComposer({ className }: PromptComposerProps) {
  const composer = usePromptComposer();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        composer.submit();
      }}
      className={cn(
        "group/composer relative w-full rounded-[1.125rem] bg-[#17191c]/72 p-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_1.5rem_5rem_-2rem_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-brightness-88 backdrop-saturate-75 transition-[box-shadow,background-color] duration-300 focus-within:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1.75rem_5.625rem_-1.875rem_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      {/* Glass sheen: a soft top light over the frosted panel, under the
          content so it never washes out the prompt. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_42%,rgba(255,255,255,0)_72%)]"
      />

      <ComposerModeSwitch mode={composer.mode} cost={composer.cost} onSwitch={composer.switchMode} />
      <ComposerPrompt composer={composer} />
      <ComposerAttachmentChip composer={composer} />
      <ComposerToolbar composer={composer} />
    </form>
  );
}
