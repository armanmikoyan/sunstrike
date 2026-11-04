import Link from "next/link";
import { cn } from "@/lib/utils";
import { RailTooltip } from "./rail-tooltip";
import type { SidebarItemProps } from "./types";

export function SidebarItem({
  label,
  href,
  icon: Icon,
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
          "group relative flex h-10 w-full shrink-0 items-center gap-3 self-center overflow-hidden rounded-xl text-muted-foreground transition-[max-width,height,padding,background-color,color] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary hover:text-foreground motion-reduce:transition-none",
          expanded
            ? rail
              ? "max-w-[11.25rem] pl-3 pr-2"
              : "max-w-full pl-3 pr-2"
            : "max-w-10 px-[0.6875rem]",
          active && "bg-secondary text-foreground",
        )}
      >
        {active ? (
          <span className="absolute left-0 h-4 w-[0.125rem] rounded-full bg-foreground" />
        ) : null}
        <Icon className="size-[1.125rem] shrink-0" strokeWidth={1.8} />
        <span
          className={cn(
            "truncate text-[0.75rem] font-medium transition-opacity duration-200 motion-reduce:transition-none",
            expanded ? "opacity-100" : "opacity-0",
          )}
        >
          {label}
        </span>
      </Link>
    </RailTooltip>
  );
}
