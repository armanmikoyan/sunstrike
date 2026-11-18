import type { ComponentProps } from "react";
import { cn } from "cn";

export function IconBox({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg border border-white/7 bg-white/2.5 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
