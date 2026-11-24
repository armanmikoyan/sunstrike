import { PresenceList } from "@/motion/presence-list";
import { AssetTile } from "./asset-tile";
import type { AssetsGridProps } from "./types";

export function AssetsGrid({ assets }: AssetsGridProps) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <PresenceList items={assets}>{(asset) => <AssetTile asset={asset} />}</PresenceList>
    </div>
  );
}
