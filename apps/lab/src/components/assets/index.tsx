"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { PageShell } from "@/ui/page-shell";
import { ASSETS } from "./constants";
import { AssetsDropZone } from "./assets-drop-zone";
import { AssetsGrid } from "./assets-grid";
import { AssetsHeader } from "./assets-header";
import { AssetsToolbar } from "./assets-toolbar";
import type { Filter } from "./types";

export function Assets() {
  const [filter, setFilter] = useState<Filter>("all");
  const reduceMotion = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visible = ASSETS.filter((asset) => filter === "all" || asset.kind === filter);

  return (
    <PageShell>
      <AssetsHeader fileInputRef={fileInputRef} />
      <AssetsDropZone />
      <AssetsToolbar filter={filter} count={visible.length} onFilterChange={setFilter} />
      <AssetsGrid assets={visible} reduceMotion={reduceMotion} />
    </PageShell>
  );
}
