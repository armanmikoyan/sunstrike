import Image from "next/image";
import { MediaKindBadge } from "@/ui/media-kind-badge";
import { ASSETS_COPY } from "./constants";
import type { AssetTileProps } from "./types";

export function AssetTile({ asset }: AssetTileProps) {
  const extension = asset.kind === "video" ? "mp4" : "jpg";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/7 bg-secondary">
      <div className="relative aspect-square">
        <Image
          src={asset.poster}
          alt={asset.title}
          fill
          sizes="200px"
          className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/5" />
        <MediaKindBadge kind={asset.kind} className="absolute left-2 top-2" />
        <div className="absolute inset-x-2 bottom-2">
          <p className="truncate font-mono text-xs lg:text-[0.6875rem] text-white/90">
            {ASSETS_COPY.storagePrefix}
            {asset.id}.{extension}
          </p>
          <p className="mt-0.5 text-xs lg:text-[0.6875rem] text-white/60">{asset.createdAt}</p>
        </div>
      </div>
    </div>
  );
}
