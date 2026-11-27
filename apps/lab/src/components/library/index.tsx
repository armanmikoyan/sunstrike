import { Link } from "@/components/link";
import { Plus } from "lucide-react";
import { LibraryView } from "@/components/library-view";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/ui/page-shell";
import { Button } from "@/ui/button";
import { LIBRARY_COPY, LIBRARY_STATS } from "./constants";

export function Library() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={LIBRARY_COPY.eyebrow}
        title={LIBRARY_COPY.title}
        description={LIBRARY_COPY.description}
        action={
          <Button asChild size="cta">
            <Link href="/create/video">
              <Plus className="size-3.5" />
              {LIBRARY_COPY.newGeneration}
            </Link>
          </Button>
        }
      />

      <div className="mt-5 grid grid-cols-1 divide-y divide-border rounded-xl border border-border bg-white/1.5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {LIBRARY_STATS.map((stat) => (
          <div key={stat.label} className="px-4 py-3.5">
            <p className="text-xs lg:text-[0.6875rem] text-muted-foreground">{stat.label}</p>
            <p className="mt-1.5 text-base font-medium tracking-[-0.02em] tabular-nums">
              {stat.label === "Spent" ? <span className="tabular-nums font-normal">{stat.value}</span> : stat.value}
            </p>
          </div>
        ))}
      </div>

      <LibraryView />
    </PageShell>
  );
}
