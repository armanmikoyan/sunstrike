import Link from "next/link";
import { MediaCard } from "@/components/media-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/ui/button";
import { mediaById } from "@/mocks/media";
import { favoriteIds, favoritesCopy } from "./constants";

const favorites = favoriteIds
  .map((id) => mediaById(id))
  .filter((item) => item !== undefined);

export function Favorites() {
  return (
    <div className="w-full px-5 py-7">
      <PageHeader
        eyebrow={favoritesCopy.eyebrow}
        title={favoritesCopy.title}
        description={favoritesCopy.description}
        action={
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-white/[0.09] bg-white/[0.015] px-3 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
          >
            <Link href="/create/video">{favoritesCopy.openInStudio}</Link>
          </Button>
        }
      />

      <div className="mt-5 columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
        {favorites.map((item) => (
          <div key={item.id} className="mb-3 break-inside-avoid">
            <MediaCard item={item} aspect={item.aspect} />
          </div>
        ))}
      </div>
    </div>
  );
}
