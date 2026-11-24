import { cn } from "cn";
import type { AccountRowLabelProps } from "./types";

export function AccountRowLabel({ children, visible = true }: AccountRowLabelProps) {
  return (
    <span
      className={cn(
        "min-w-0 flex-1 transition-opacity duration-200 motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="block truncate text-xs font-medium text-foreground lg:text-[0.6875rem]">{children}</span>
    </span>
  );
}
