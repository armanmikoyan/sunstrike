import { Link } from "@/components/link";
import { cn } from "cn";
import { RailTooltip } from "./rail-tooltip";
import type { SidebarItemProps } from "./types";

export function SidebarItem({
  label,
  href,
  icon: Icon,
  iconClassName,
  active,
  expanded,
  rail,
  onNavigate,
  onHover,
}: SidebarItemProps) {
  return (
    <div className="relative w-full shrink-0">
      <RailTooltip expanded={expanded} label={label}>
        <Link
          href={href}
          aria-label={label}
          onClick={onNavigate}
          onPointerEnter={(event) => onHover?.(event.currentTarget)}
          className={cn(
            "group relative flex h-9 w-full shrink-0 items-center gap-2.5 self-center overflow-hidden rounded-lg px-2.25 text-muted-foreground transition-[max-width,height,background-color,color] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground motion-reduce:transition-none",
            expanded ? (rail ? "max-w-45" : "max-w-full") : "max-w-9",
            active && "bg-secondary text-foreground",
          )}
        >
          <Icon className={cn("size-4.5 shrink-0", iconClassName)} strokeWidth={1.8} />
          <span
            className={cn(
              "truncate text-sm font-medium transition-opacity duration-200 motion-reduce:transition-none lg:text-[0.6875rem]",
              expanded ? "opacity-100" : "opacity-0",
            )}
          >
            {label}
          </span>
        </Link>
      </RailTooltip>
      {active ? (
        <span
          aria-hidden="true"
          className="absolute -left-2.5 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand"
        />
      ) : null}
    </div>
  );
}
