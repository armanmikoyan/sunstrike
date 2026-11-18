"use client";

import { AnimatePresence, motion } from "motion/react";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { AssetTile } from "./asset-tile";
import type { AssetsGridProps } from "./types";

export function AssetsGrid({ assets, reduceMotion }: AssetsGridProps) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <AnimatePresence initial={false} mode="popLayout">
        {assets.map((asset) => (
          <motion.div
            key={asset.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={reduceMotion ? INSTANT_TRANSITION : LAYOUT_SPRING}
          >
            <AssetTile asset={asset} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
