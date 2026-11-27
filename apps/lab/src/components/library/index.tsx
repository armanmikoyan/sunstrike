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

      <dl className="mt-5 grid grid-cols-3 gap-x-6 sm:max-w-md">
        {LIBRARY_STATS.map((stat) => (
          <div key={stat.label}>
            <dt className="text-xs lg:text-[0.6875rem] text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 text-sm font-medium tracking-[-0.01em] tabular-nums text-foreground">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <LibraryView />
    </PageShell>
  );
}
