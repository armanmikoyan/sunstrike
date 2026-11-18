import type { ComponentProps } from "react";
import { cn } from "cn";

export function CountBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs lg:text-[0.6875rem] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
