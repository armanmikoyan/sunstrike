"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Film,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/ui/button";
import { mediaById } from "@/mocks/media";
import { instantTransition, layoutSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { assetIds, assetsCopy } from "./constants";

const assets = assetIds
  .map((id) => mediaById(id))
  .filter((item) => item !== undefined);

type Filter = "all" | "video" | "image";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: assetsCopy.filters.all },
  { value: "video", label: assetsCopy.filters.video },
  { value: "image", label: assetsCopy.filters.image },
];

export function Assets() {
  const [filter, setFilter] = useState<Filter>("all");
  const reduceMotion = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visible = assets.filter(
    (asset) => filter === "all" || asset.kind === filter,
  );

  return (
    <div className="w-full px-5 py-7">
      <PageHeader
        eyebrow={assetsCopy.eyebrow}
        title={assetsCopy.title}
        description={assetsCopy.description}
        action={
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 rounded-lg border-white/[0.09] bg-white/[0.015] px-3 text-[0.6875rem] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
          >
            <UploadCloud className="size-3.5" />
            {assetsCopy.upload}
          </Button>
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        className="hidden"
      />

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.11] bg-white/[0.015] px-5 py-8 text-center transition-colors hover:border-white/20 hover:bg-white/[0.03]">
        <span className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-muted-foreground">
          <UploadCloud className="size-4" />
        </span>
        <p className="mt-3 text-[0.6875rem] font-medium">
          {assetsCopy.dropTitle}
        </p>
        <p className="mt-1 text-[0.6875rem] text-muted-foreground">
          {assetsCopy.dropHint}
        </p>
        <input type="file" multiple className="hidden" />
      </label>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[0.8125rem] font-medium">
            {assetsCopy.recentTitle}
          </h2>
          <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
            {visible.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-md px-2 text-[0.6875rem] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground",
                filter === item.value &&
                  "bg-white/[0.06] text-foreground hover:bg-white/[0.06]",
              )}
            >
              {item.value === "image" ? (
                <ImageIcon className="size-2.5" />
              ) : item.value === "video" ? (
                <Film className="size-2.5" />
              ) : null}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((asset) => {
            const extension = asset.kind === "video" ? "mp4" : "jpg";
            return (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={reduceMotion ? instantTransition : layoutSpring}
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
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded border border-white/15 bg-black/35 px-1.5 py-0.5 text-[0.6875rem] text-white/80 backdrop-blur">
                    {asset.kind === "video" ? (
                      <Film className="size-2.5" />
                    ) : (
                      <ImageIcon className="size-2.5" />
                    )}
                    {assetsCopy.kindLabels[asset.kind]}
                  </span>
                  <div className="absolute inset-x-2 bottom-2">
                    <p className="truncate font-mono text-[0.6875rem] text-white/90">
                      {assetsCopy.storagePrefix}
                      {asset.id}.{extension}
                    </p>
                    <p className="mt-0.5 text-[0.6875rem] text-white/60">
                      {asset.createdAt}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
