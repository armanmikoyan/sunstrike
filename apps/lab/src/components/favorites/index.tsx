import Link from "next/link";
import { MediaCard } from "@/components/media-card";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/ui/page-shell";
import { Button } from "@/ui/button";
import { favoriteItems } from "@/mocks/media";
import { FAVORITES_COPY } from "./constants";

export function Favorites() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={FAVORITES_COPY.eyebrow}
        title={FAVORITES_COPY.title}
        description={FAVORITES_COPY.description}
        action={
          <Button asChild variant="subtle" size="cta-sm">
            <Link href="/create/video">{FAVORITES_COPY.openInStudio}</Link>
          </Button>
        }
      />

      <div className="mt-5 columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
        {favoriteItems.map((item) => (
          <div key={item.id} className="mb-3 break-inside-avoid">
            <MediaCard item={item} aspect={item.aspect} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
