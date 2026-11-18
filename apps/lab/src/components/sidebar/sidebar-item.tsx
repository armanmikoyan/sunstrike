import Link from "next/link";
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
}: SidebarItemProps) {
  // The trigger stays mounted in both states so the rail can animate the link
  // instead of swapping it for a new element. Tooltips only exist while
  // collapsed, and the wrapper drops any hover state left over from the
  // expanded rail so collapsing cannot pop one the pointer never asked for.
  return (
    <div className="relative w-full shrink-0">
      <RailTooltip expanded={expanded} label={label}>
        <Link
          href={href}
          aria-label={label}
          onClick={onNavigate}
          className={cn(
            // Width stays 100%; the cap animates from the 40px icon box to the
            // 180px content column (200px rail minus its 10px insets). Capping a
            // full-width box keeps its edge travelling in one direction — a
            // `w-10 → w-full` transition re-reads 100% every frame and bulges.
            "group relative flex h-9 w-full shrink-0 items-center gap-2.5 self-center overflow-hidden rounded-lg text-muted-foreground transition-[max-width,height,padding,background-color,color] duration-260 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground motion-reduce:transition-none",
            expanded ? (rail ? "max-w-45 pl-2.5 pr-2" : "max-w-full pl-2.5 pr-2") : "max-w-9 px-2.25",
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
