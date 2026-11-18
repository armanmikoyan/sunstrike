import type { ReactNode } from "react";
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/1.5 text-center",
        className,
      )}
    >
      <Icon className="size-5 text-muted-foreground" />
      <p className="mt-3 text-sm font-medium lg:text-xs">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground lg:text-xs">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
