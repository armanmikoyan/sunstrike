/**
 * Placeholder for the studio shell while the route's `mode` param streams in.
 * It mirrors the real frame so the panels do not jump when the studio mounts.
 */
export function StudioSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[calc(100vh-3rem)] flex-col lg:h-[calc(100vh-3rem)] lg:min-h-[45rem] lg:overflow-hidden"
    >
      <div className="h-12 shrink-0 border-b border-border" />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="w-full shrink-0 space-y-3 border-b border-border bg-[#0f1113] p-4 lg:w-[24.25rem] lg:border-b-0 lg:border-r">
          <div className="h-20 rounded-lg bg-white/[0.03]" />
          <div className="h-8 rounded-md bg-white/[0.015]" />
          <div className="h-8 w-3/4 rounded-md bg-white/[0.015]" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="h-10 shrink-0 border-b border-border" />
          <div className="min-h-0 flex-1 p-4 sm:p-6">
            <div className="mx-auto aspect-video max-w-[47.5rem] rounded-xl border border-white/[0.08] bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
