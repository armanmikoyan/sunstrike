"use client";

import { useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { cn } from "cn";
import { useHaptics } from "@/hooks/use-haptics";
import type { LucideIcon } from "lucide-react";

type SegmentedTabsOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

type SegmentedTabsProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly SegmentedTabsOption<T>[];
  ariaLabel: string;
  className?: string;
  fullWidth?: boolean;
  scrollable?: boolean;
};

export function SegmentedTabs<T extends string>({
  value,
  onValueChange,
  options,
  ariaLabel,
  className,
  fullWidth = false,
  scrollable = false,
}: SegmentedTabsProps<T>) {
  const { pulse } = useHaptics();
  const pulsed = useRef<T | null>(null);
  const list = (
    <TabsList
      aria-label={ariaLabel}
      className={cn(
        "group-data-horizontal/tabs:h-9 gap-0 rounded-lg border border-white/7 bg-white/1.5 p-0.5 lg:group-data-horizontal/tabs:h-8",
        fullWidth && "flex w-full",
      )}
    >
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <TabsTrigger
            key={option.value}
            value={option.value}
            // The panel lives outside this control, so Radix's default
            // `aria-controls` would point at a node that never renders.
            aria-controls={undefined}
            className={cn(
              "flex-none gap-1.5 rounded-[0.625rem] px-2.5 text-[0.8125rem] font-medium text-muted-foreground group-data-[variant=default]/tabs-list:data-active:shadow-none data-active:bg-white/8 data-active:text-foreground lg:px-2.5 lg:text-[0.8125rem] dark:data-active:border-transparent dark:data-active:bg-white/8 dark:data-active:text-foreground",
              fullWidth && "flex-1",
            )}
          >
            {Icon ? <Icon className="size-3" /> : null}
            {option.label}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );

  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        if (next === value) return;
        // Radix can report the same change twice before the value prop
        // updates; pulse once per destination.
        const destination = next as T;
        if (pulsed.current !== destination) {
          pulsed.current = destination;
          pulse(8);
        }
        onValueChange(destination);
      }}
      className={className}
    >
      {scrollable ? <div className="no-scrollbar -mx-1 overflow-x-auto overflow-y-hidden px-1">{list}</div> : list}
    </Tabs>
  );
}
