import { cn } from "cn";
import type { PageHeaderProps } from "./types";

export function PageHeader({ eyebrow, title, description, action, className, divider = true }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-5 pb-6 sm:flex-row sm:items-end",
        divider && "border-b border-border",
        className,
      )}
    >
      <div>
        {eyebrow ? <div className="mb-2 text-xs text-muted-foreground lg:text-[0.6875rem]">{eyebrow}</div> : null}
        <h1 className="text-[1.75rem] font-medium leading-tight tracking-[-0.035em] sm:text-[2rem]">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground lg:text-xs">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
