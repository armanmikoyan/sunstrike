import Link from "next/link";
import { Plus } from "lucide-react";
import { LibraryView } from "@/components/gallery/library-view";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Library",
};

const stats = [
  { label: "Frames generated", value: "148" },
  { label: "Video seconds", value: "4:12" },
  { label: "Spent", value: "$32.10" },
  { label: "Favorites", value: "21" },
];

export default function LibraryPage() {
  return (
    <div className="w-full px-5 py-7">
      <PageHeader
        eyebrow="Your studio"
        title="Library"
        description="Every frame and take you've generated. Downloads stay attached to their prompt, model and cost."
        action={
          <Button
            asChild
            className="h-10 rounded-lg bg-brand px-4 text-[12px] font-medium text-brand-foreground hover:bg-brand-hover"
          >
            <Link href="/create/video">
              <Plus className="size-3.5" />
              New generation
            </Link>
          </Button>
        }
      />

      <div className="mt-5 grid grid-cols-2 divide-x divide-border rounded-xl border border-border bg-white/[0.015] sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-3.5">
            <p className="text-[11px] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1.5 text-[18px] font-medium tracking-[-0.02em] tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <LibraryView />
    </div>
  );
}
