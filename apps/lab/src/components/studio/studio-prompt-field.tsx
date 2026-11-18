"use client";

import { Textarea } from "@/ui/textarea";
import { STUDIO_COPY } from "./constants";
import type { StudioScopedProps } from "./types";

export function StudioPromptField({ studio }: StudioScopedProps) {
  return (
    <div>
      <label htmlFor="studio-prompt" className="text-xs lg:text-[0.6875rem] font-medium text-muted-foreground">
        {STUDIO_COPY.controls.prompt}
      </label>
      <div className="relative mt-2">
        <Textarea
          id="studio-prompt"
          value={studio.prompt}
          onChange={(event) => studio.setPrompt(event.target.value)}
          placeholder={STUDIO_COPY.controls.placeholders[studio.isVideo ? "video" : "image"]}
          className="min-h-28 resize-none border-white/8 bg-white/1.5 px-3 py-2.5 leading-relaxed placeholder:text-muted-foreground/65 focus-visible:border-white/25 focus-visible:ring-white/10"
        />
      </div>
    </div>
  );
}
