import Link from "next/link";
import { FolderHeart, Heart, Plus } from "lucide-react";
import { MediaCard } from "@/components/gallery/media-card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { mediaById } from "@/lib/media";

export const metadata = {
  title: "Favorites",
};

const favoriteIds = ["02", "07", "09", "10", "14", "16", "17", "11"];
const favorites = favoriteIds
  .map((id) => mediaById(id))
  .filter((item) => item !== undefined);

const collections = [
  { name: "Film references", count: 12, active: true },
  { name: "Product looks", count: 8, active: false },
  { name: "Faces", count: 6, active: false },
];

export default function FavoritesPage() {
  return (
    <div className="w-full px-5 py-7">
      <PageHeader
        eyebrow="Collection"
        title="Favorites"
        description="Frames you've saved for later. Keep references close, then remix them into the studio."
        action={
          <Button
            variant="outline"
            className="h-9 rounded-lg border-white/[0.09] bg-white/[0.02] px-3 text-[11px] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
          >
            <Plus className="size-3.5" />
            New collection
          </Button>
        }
      />

      <div className="mt-5 flex gap-2 overflow-x-auto">
        {collections.map((collection) => (
          <button
            key={collection.name}
            type="button"
            className={
              collection.active
                ? "flex shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-[11px] font-medium text-foreground"
                : "flex shrink-0 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.015] px-3 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            }
          >
            <FolderHeart className="size-3.5" />
            {collection.name}
            <span className="font-mono text-[11px] opacity-60">
              {collection.count}
            </span>
          </button>
        ))}
        <div className="flex shrink-0 items-center gap-1.5 px-2 text-[11px] text-muted-foreground">
          <Heart className="size-3 text-muted-foreground" />
          {favorites.length} single frames
        </div>
      </div>

      <div className="mt-5 columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
        {favorites.map((item) => (
          <div key={item.id} className="mb-3 break-inside-avoid">
            <MediaCard item={item} aspect={item.aspect} />
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#18191c] p-5 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
            <Heart className="size-4" />
          </span>
          <div>
            <p className="text-[11px] font-medium">Your references, ready</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Open a collection as a reference set in the studio.
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-8 rounded-lg border-white/10 bg-transparent text-[11px] hover:bg-white/[0.04]"
        >
          <Link href="/create/video">Open in studio</Link>
        </Button>
      </div>
    </div>
  );
}
