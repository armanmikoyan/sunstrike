import { cn } from "cn";
import { SKELETON_BAR } from "@/components/studio/constants";

export function PricingModelRowSkeleton() {
  return (
    <div aria-hidden className="grid gap-3 bg-card px-5 py-4 md:grid-cols-[1fr_14rem] md:items-start md:gap-6">
      <div className="space-y-2.5">
        <span className={cn(SKELETON_BAR, "h-3.5 w-40")} />
        <span className={cn(SKELETON_BAR, "h-2.5 w-64")} />
        <span className={cn(SKELETON_BAR, "h-2.5 w-48")} />
      </div>
      <div className="space-y-2.5 md:justify-items-end md:grid">
        <span className={cn(SKELETON_BAR, "h-3.5 w-24")} />
        <span className={cn(SKELETON_BAR, "h-2.5 w-32")} />
      </div>
    </div>
  );
}
