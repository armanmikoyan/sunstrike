import Link from "next/link";
import { Plus } from "lucide-react";
import { LibraryView } from "@/components/library-view";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/ui/button";
import { libraryCopy, libraryStats } from "./constants";

export function Library() {
  return (
    <div className="w-full px-5 py-7">
      <PageHeader
        eyebrow={libraryCopy.eyebrow}
        title={libraryCopy.title}
        description={libraryCopy.description}
        action={
          <Button
            asChild
            className="h-10 rounded-lg bg-brand px-4 text-[0.75rem] font-medium text-brand-foreground hover:bg-brand-hover"
          >
            <Link href="/create/video">
              <Plus className="size-3.5" />
              {libraryCopy.newGeneration}
            </Link>
          </Button>
        }
      />

      <div className="mt-5 grid grid-cols-2 divide-x divide-border rounded-xl border border-border bg-white/[0.015] sm:grid-cols-4">
        {libraryStats.map((stat) => (
          <div key={stat.label} className="px-4 py-3.5">
            <p className="text-[0.6875rem] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1.5 text-[1.125rem] font-medium tracking-[-0.02em] tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <LibraryView />
    </div>
  );
}
