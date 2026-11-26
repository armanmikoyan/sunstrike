"use client";

import { StudioDurationMenu } from "@/components/studio/studio-duration-menu";
import { COMPOSER_COPY } from "./constants";
import type { ComposerProps } from "./types";

export function ComposerDurationMenu({ composer: { duration, setDuration, durationOptions } }: ComposerProps) {
  return (
    <StudioDurationMenu
      className="w-14 justify-center gap-1 font-medium text-muted-foreground hover:bg-white/5.5 hover:text-foreground"
      contentClassName="w-60"
      options={durationOptions}
      value={duration}
      onValueChange={setDuration}
      label={COMPOSER_COPY.duration}
      menuLabel
    />
  );
}
