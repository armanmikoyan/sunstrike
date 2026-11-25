import { SegmentedTabs } from "@/ui/segmented-tabs";
import { COMPOSER_COPY, MODE_OPTIONS } from "./constants";
import type { ComposerModeSwitchProps } from "./types";

export function ComposerModeSwitch({ mode, onSwitch }: ComposerModeSwitchProps) {
  return (
    <div className="flex items-center px-1.5 pb-1 pt-1">
      <SegmentedTabs
        value={mode}
        onValueChange={onSwitch}
        options={MODE_OPTIONS}
        ariaLabel={COMPOSER_COPY.modeLabel}
        className="w-fit"
      />
    </div>
  );
}
