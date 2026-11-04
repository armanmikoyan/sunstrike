"use client";

import { ExploreResults } from "./explore-results";
import { ExploreToolbar } from "./explore-toolbar";
import { useExploreGallery } from "./hooks";

export function ExploreGallery() {
  const gallery = useExploreGallery();

  return (
    <div>
      <ExploreToolbar gallery={gallery} />
      <ExploreResults gallery={gallery} />
    </div>
  );
}
