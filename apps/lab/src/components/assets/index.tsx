"use client";

import { useRef, useState } from "react";
import { PageShell } from "@/ui/page-shell";
import { assetItems } from "@/mocks/media";
import { AssetsDropZone } from "./assets-drop-zone";
import { AssetsGrid } from "./assets-grid";
import { AssetsHeader } from "./assets-header";
import { AssetsToolbar } from "./assets-toolbar";
import { filterMedia } from "@/components/media-card/utils";
import type { MediaFilter } from "@/components/media-card/types";

export function Assets() {
  const [filter, setFilter] = useState<MediaFilter>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visible = filterMedia(assetItems, filter);

  return (
    <PageShell>
      <AssetsHeader fileInputRef={fileInputRef} />
      <AssetsDropZone />
      <AssetsToolbar filter={filter} count={visible.length} onFilterChange={setFilter} />
      <AssetsGrid assets={visible} />
    </PageShell>
  );
}
