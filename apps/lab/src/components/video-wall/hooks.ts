import { useEffect, useState } from "react";
import { WALL_IDLE_FALLBACK_MS, WALL_IDLE_TIMEOUT_MS } from "./constants";

/**
 * The wall paints posters first and only mounts its players once the browser
 * is idle, so the first frame and the largest paint never wait on video.
 */
export function useWallLive() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    let idle: number | null = null;
    let timer: number | null = null;

    const start = () => setLive(true);

    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(start, { timeout: WALL_IDLE_TIMEOUT_MS });
    } else {
      timer = window.setTimeout(start, WALL_IDLE_FALLBACK_MS);
    }

    return () => {
      if (idle !== null) window.cancelIdleCallback(idle);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, []);

  return live;
}
