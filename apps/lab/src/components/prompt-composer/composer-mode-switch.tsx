import { SegmentedTabs } from "@/ui/segmented-tabs";
import { StudioCost } from "@/components/studio/studio-cost";
import { COMPOSER_COPY, MODE_OPTIONS } from "./constants";
import type { ComposerModeSwitchProps } from "./types";

export function ComposerModeSwitch({ mode, cost, onSwitch }: ComposerModeSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-1.5 pb-1 pt-1">
      <SegmentedTabs
        value={mode}
        onValueChange={onSwitch}
        options={MODE_OPTIONS}
        ariaLabel={COMPOSER_COPY.modeLabel}
        className="w-fit"
      />
      <div className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
        <span className="hidden sm:inline">{COMPOSER_COPY.estimated}</span>
        <span className="font-mono text-xs lg:text-[0.6875rem] text-foreground/75">
          <StudioCost cost={cost} />
        </span>
      </div>
    </div>
  );
}
