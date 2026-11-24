export function StudioSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[calc(100vh-3rem)] flex-col lg:h-[calc(100vh-3rem)] lg:min-h-180 lg:overflow-hidden"
    >
      <div className="h-12 shrink-0 border-b border-border" />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="w-full shrink-0 space-y-3 border-b border-border bg-background p-4 lg:w-97 lg:border-b-0 lg:border-r">
          <div className="h-20 rounded-lg bg-white/3" />
          <div className="h-8 rounded-md bg-white/1.5" />
          <div className="h-8 w-3/4 rounded-md bg-white/1.5" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="h-10 shrink-0 border-b border-border" />
          <div className="min-h-0 flex-1 p-4 sm:p-6">
            <div className="mx-auto aspect-video max-w-190 rounded-xl border border-white/8 bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
