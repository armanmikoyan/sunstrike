import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
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
    { value: "video" as const, label: composerCopy.modeLabels.video },
    { value: "image" as const, label: composerCopy.modeLabels.image },
  ];

  return (
    <div className="flex items-center justify-between gap-3 px-1.5 pb-1 pt-1">
      <Tabs
        value={mode}
        onValueChange={(value) => onSwitch(value as typeof mode)}
        className="w-fit data-horizontal:flex-row"
      >
        <TabsList className="gap-0 rounded-lg border border-white/[0.06] bg-white/[0.025] p-0.5 group-data-horizontal/tabs:h-9 lg:group-data-horizontal/tabs:h-7">
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className={cn(
                "flex-none rounded-[0.625rem] px-2.5 text-sm font-medium text-muted-foreground data-active:bg-white/[0.08] data-active:text-foreground data-active:shadow-none lg:text-[0.6875rem] dark:data-active:border-transparent dark:data-active:bg-white/[0.08]",
                mode === option.value && "text-foreground",
              )}
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-1.5 text-xs lg:text-[0.6875rem] text-muted-foreground">
        <span className="hidden sm:inline">{composerCopy.estimated}</span>
        <span className="font-mono text-xs lg:text-[0.6875rem] text-foreground/75">
          <span className="tabular-nums font-normal">{formatUSD(cost)}</span>
        </span>
      </div>
    </div>
  );
}
