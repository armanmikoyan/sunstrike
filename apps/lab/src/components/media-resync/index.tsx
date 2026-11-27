"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { RESYNC_DELAY_MS } from "./constants";

/**
 * Stops every player on a route commit, then asks the players to re-evaluate
 * once the new tree has laid out. Visible clips resume; clips hidden behind a
 * retained route stay paused even though no observer fired for them.
 */
export function MediaResync() {
  const pathname = usePathname();

  useEffect(() => {
    for (const video of document.querySelectorAll("video")) video.pause();

    const frame = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("wildscape:media-resync"));
    });
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("wildscape:media-resync"));
    }, RESYNC_DELAY_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
