import { cn } from "cn";
import { SKELETON_BAR, ZERO_WIDTH_SPACE } from "./constants";
import type { StudioSkeletonLineProps } from "./types";

export function StudioSkeletonLine({ width, className }: StudioSkeletonLineProps) {
  return (
    <span className={cn("flex items-center text-xs lg:text-[0.6875rem]", className)}>
      <span className={cn(SKELETON_BAR, "h-2", width)} />
      {ZERO_WIDTH_SPACE}
    </span>
  );
}
