import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <hgroup className="max-w-[680px]">
        <h2 className="font-grotesk text-[17px] font-semibold uppercase leading-tight tracking-[0.1em] text-foreground sm:text-[19px]">
          {title}
        </h2>
        <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </hgroup>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
