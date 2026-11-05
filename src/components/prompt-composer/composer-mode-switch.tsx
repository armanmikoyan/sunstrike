import { Film, Image as ImageIcon } from "lucide-react";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { composerCopy } from "./constants";
import type { ComposerModeSwitchProps } from "./types";

export function ComposerModeSwitch({
  mode,
  cost,
  onSwitch,
}: ComposerModeSwitchProps) {
  const options = [
    { value: "video" as const, label: composerCopy.modeLabels.video, icon: Film },
    { value: "image" as const, label: composerCopy.modeLabels.image, icon: ImageIcon },
  ];

  return (
    <div className="flex items-center justify-between gap-3 px-1.5 pb-1 pt-1">
      <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.07] bg-white/[0.025] p-0.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSwitch(option.value)}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[0.6875rem] font-medium text-muted-foreground transition-colors",
              mode === option.value &&
                "bg-white/[0.085] text-foreground shadow-sm",
            )}
          >
            <option.icon className="size-3" />
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
        <span className="hidden sm:inline">{composerCopy.estimated}</span>
        <span className="font-mono text-[0.6875rem] text-foreground/75">
          {formatUSD(cost)}
        </span>
      </div>
    </div>
  );
}
