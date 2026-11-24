import { cn } from "cn";
import type { PaneHeaderProps } from "./types";

export function PaneHeader({ title, description, action, className }: PaneHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3 border-b border-white/6 px-5 py-4", className)}>
      <div>
        <h2 className="text-sm lg:text-xs font-medium">{title}</h2>
        {description ? <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
