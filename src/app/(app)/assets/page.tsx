import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Folder,
  Image as ImageIcon,
  MoreHorizontal,
  Plus,
  UploadCloud,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mediaById } from "@/lib/media";

export const metadata = {
  title: "Assets",
};

const folders = [
  {
    id: "references",
    name: "References",
    count: 24,
    cover: "02",
    type: "Mixed",
  },
  {
    id: "products",
    name: "Product plates",
    count: 12,
    cover: "17",
    type: "Images",
  },
  {
    id: "locations",
    name: "Locations",
    count: 18,
    cover: "11",
    type: "Images",
  },
  {
    id: "characters",
    name: "Characters",
    count: 8,
    cover: "01",
    type: "Faces",
  },
];

const assets = ["01", "02", "04", "05", "06", "07", "10", "11", "13", "15", "17", "18"]
  .map((id) => mediaById(id))
  .filter((item) => item !== undefined);

export default function AssetsPage() {
  return (
    <div className="w-full px-5 py-7">
      <PageHeader
        eyebrow="Studio"
        title="Assets"
        description="References, product plates and identity. Available to every generation across your workspace."
        action={
          <Button
            variant="outline"
            className="h-9 rounded-lg border-white/[0.09] bg-white/[0.02] px-3 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
          >
            <UploadCloud className="size-3.5" />
            Upload
          </Button>
        }
      />

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.11] bg-white/[0.012] px-5 py-8 text-center transition-colors hover:border-white/20 hover:bg-white/[0.03]">
        <span className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
          <UploadCloud className="size-4" />
        </span>
        <p className="mt-3 text-[0.6875rem] font-medium">
          Drop files here or click to upload
        </p>
        <p className="mt-1 text-[0.6875rem] text-muted-foreground">
          Images, video, PDF or SVG · up to 50 MB per file
        </p>
        <input type="file" multiple className="hidden" />
      </label>

      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-[0.8125rem] font-medium">Folders</h2>
        <button
          type="button"
          className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="size-2.5" />
          New folder
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {folders.map((folder) => {
          const cover = mediaById(folder.cover);
          return (
            <Link
              key={folder.id}
              href={`/assets?folder=${folder.id}`}
              className="group overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015] transition-colors hover:border-white/15"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                {cover ? (
                  <Image
                    src={cover.poster}
                    alt={folder.name}
                    fill
                    sizes="300px"
                    className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md border border-white/15 bg-black/40 px-1.5 py-1 text-[0.6875rem] text-white/80 backdrop-blur">
                  <Folder className="size-2.5" />
                  {folder.count} files
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div>
                  <p className="text-[0.6875rem] font-medium">{folder.name}</p>
                  <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                    {folder.type}
                  </p>
                </div>
                <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[0.8125rem] font-medium">Recent assets</h2>
          <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
            36
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-7 items-center gap-1.5 rounded-md bg-white/[0.06] px-2 text-[0.6875rem] text-foreground"
          >
            <ImageIcon className="size-2.5" />
            Images
          </button>
          <button
            type="button"
            className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
          >
            <Folder className="size-2.5" />
            All
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="group relative overflow-hidden rounded-lg border border-white/[0.07] bg-secondary"
          >
            <div className="relative aspect-square">
              <Image
                src={asset.poster}
                alt={asset.title}
                fill
                sizes="200px"
                className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/5" />
              <button
                type="button"
                aria-label="Asset options"
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-md border border-white/10 bg-black/35 text-white/65 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="size-3" />
              </button>
              <div className="absolute inset-x-2 bottom-2">
                <p className="truncate text-[0.6875rem] text-white/90">
                  {asset.title.toLowerCase().replaceAll(" ", "-")}.jpg
                </p>
                <p className="mt-0.5 text-[0.6875rem] text-white/60">
                  {asset.aspect} · 1.4 MB
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
