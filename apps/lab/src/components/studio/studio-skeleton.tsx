import { cn } from "cn";
import { SKELETON_BAR, SKELETON_SLOTS, SKELETON_SURFACE, STUDIO_FRAME_CLASSES } from "./constants";
import { StudioSkeletonLine } from "./studio-skeleton-line";
import { slots } from "./utils";

export function StudioSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[calc(100vh-3rem)] animate-pulse flex-col lg:h-[calc(100vh-3rem)] lg:min-h-180 lg:overflow-hidden"
    >
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="size-7 rounded-md bg-white/4" />
          <span className="h-4 w-px bg-border" />
          <span className={cn(SKELETON_BAR, "h-2 w-19")} />
          <span className="ml-1 hidden h-7 w-29 rounded-lg border border-white/6 bg-white/2.5 sm:block" />
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden h-6 w-14 rounded-md border border-white/7 md:block" />
          <span className="h-7 w-19 rounded-md border border-white/9 bg-white/2.5" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex w-full shrink-0 flex-col border-b border-border bg-background lg:w-97 lg:border-b-0 lg:border-r">
          <div className="min-h-0 flex-1 overflow-hidden p-4">
            <StudioSkeletonLine width="w-9" className="h-6" />
            <div className={cn(SKELETON_SURFACE, "mt-2 h-28")} />

            <div className="mt-5 flex items-center justify-between">
              <StudioSkeletonLine width="w-15" />
              <StudioSkeletonLine width="w-11" />
            </div>
            <div className="mt-2 grid grid-cols-[1fr_3.625rem] gap-2">
              <div className="h-17.5 rounded-xl border border-dashed border-white/11 bg-white/1.5" />
              <div className="h-17.5 rounded-xl border border-white/8 bg-white/1.5" />
            </div>

            <StudioSkeletonLine width="w-13" className="mt-5" />
            <div className={cn(SKELETON_SURFACE, "mt-2 h-9")} />

            <StudioSkeletonLine width="w-8" className="mt-5" />
            <div className={cn(SKELETON_SURFACE, "mt-2 h-9")} />
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <StudioSkeletonLine width="w-64" />
              <StudioSkeletonLine width="w-17" />
            </div>

            <StudioSkeletonLine width="w-16" className="mt-5" />
            <div className={cn(SKELETON_SURFACE, "mt-2 grid grid-cols-6 gap-1 p-0.5")}>
              {slots(SKELETON_SLOTS.aspects).map((slot) => (
                <span key={slot} className={cn("h-7 rounded-[0.625rem]", slot === 0 && "bg-white/6")} />
              ))}
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <StudioSkeletonLine width="w-14" />
              <StudioSkeletonLine width="w-8" />
            </div>

            <StudioSkeletonLine width="w-15" className="mt-5" />
            <div className={cn(SKELETON_SURFACE, "mt-2 h-9")} />

            <StudioSkeletonLine width="w-12" className="mt-5" />
            <div className={cn(SKELETON_SURFACE, "mt-2 flex h-9 items-center px-3")}>
              <span className={cn(SKELETON_BAR, "h-1 w-full")} />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <StudioSkeletonLine width="w-10" />
              <StudioSkeletonLine width="w-5" />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <StudioSkeletonLine width="w-17" />
                <StudioSkeletonLine width="w-48" />
              </div>
              <span className="h-4.5 w-8 rounded-full bg-white/6" />
            </div>
          </div>

          <div className="border-t border-border bg-white/1.5 p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <StudioSkeletonLine width="w-20" />
              <StudioSkeletonLine width="w-9" />
            </div>
            <div className="h-10 rounded-xl bg-white/8" />
            <StudioSkeletonLine width="w-46" className="mt-2 justify-center" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
            <div className="flex items-center gap-2">
              <StudioSkeletonLine width="w-11" />
              <span className="h-4.5 w-9 rounded-md bg-white/4" />
            </div>
            <div className="flex items-center gap-1">
              <span className="hidden h-5 w-11 rounded border border-white/8 sm:block" />
              <span className="size-7 rounded-md bg-white/3" />
              <span className="size-7 rounded-md bg-white/3" />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
            <div className="mx-auto max-w-245">
              <div
                className={cn(
                  "mx-auto w-full rounded-xl border border-white/10 bg-secondary",
                  STUDIO_FRAME_CLASSES["16:9"],
                )}
              />

              <div className="mx-auto mt-3 flex max-w-245 items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <StudioSkeletonLine width="w-24" />
                  <StudioSkeletonLine width="w-52" />
                </div>
                <span className="h-7 w-22 rounded-md border border-white/8" />
              </div>

              <div className="mx-auto mt-7 max-w-245">
                <div className="flex h-4.5 items-center justify-between">
                  <StudioSkeletonLine width="w-22" />
                  <StudioSkeletonLine width="w-14" />
                </div>
                <div className="mt-2.5 grid grid-cols-4 gap-2">
                  {slots(SKELETON_SLOTS.takes).map((slot) => (
                    <div key={slot} className="aspect-3/4 rounded-lg border border-white/7 bg-secondary" />
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-7 grid max-w-245 gap-2 sm:grid-cols-3">
                {slots(SKELETON_SLOTS.facts).map((slot) => (
                  <div key={slot} className={cn(SKELETON_SURFACE, "flex items-center gap-2.5 px-3 py-2.5")}>
                    <span className="size-3 rounded-sm bg-white/6" />
                    <div className="space-y-0.5">
                      <StudioSkeletonLine width="w-11" />
                      <StudioSkeletonLine width="w-28" />
                    </div>
                  </div>
                ))}
              </div>

              <div className={cn(SKELETON_SURFACE, "mx-auto mt-2.5 max-w-245 p-3")}>
                <StudioSkeletonLine width="w-22" />
                <StudioSkeletonLine width="w-full" className="mt-1.5 h-4.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
