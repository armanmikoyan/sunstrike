import Link from "next/link";
import { MediaCard } from "@/components/media-card";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/ui/page-shell";
import { Button } from "@/ui/button";
import { FAVORITES, FAVORITES_COPY } from "./constants";

export function Favorites() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={FAVORITES_COPY.eyebrow}
        title={FAVORITES_COPY.title}
        description={FAVORITES_COPY.description}
        action={
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-white/9 bg-white/1.5 px-3 text-xs lg:text-[0.6875rem] text-muted-foreground hover:bg-white/4.5 hover:text-foreground"
          >
            <Link href="/create/video">{FAVORITES_COPY.openInStudio}</Link>
          </Button>
        }
      />

      <div className="mt-5 columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
        {FAVORITES.map((item) => (
          <div key={item.id} className="mb-3 break-inside-avoid">
            <MediaCard item={item} aspect={item.aspect} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
