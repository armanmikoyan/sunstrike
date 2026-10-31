"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The hero wall renders the same clip more than once (looped columns), so
 * every player of a given source is aligned to the first one that loads.
 * Without this the duplicate shows a different frame at the loop seam and the
 * wall visibly jumps.
 */
const players = new Map<string, HTMLVideoElement>();

export function VideoWithFallback({
  src,
  poster,
  fallback,
  className,
  preload = "metadata",
}: {
  src: string;
  poster?: string;
  fallback: string;
  className?: string;
  preload?: ComponentProps<"video">["preload"];
}) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const aligned = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const start = () => {
      if (!aligned.current) {
        aligned.current = true;
        const primary = players.get(src);
        if (!primary || primary === video) {
          players.set(src, video);
        } else if (Number.isFinite(primary.currentTime)) {
          try {
            video.currentTime = primary.currentTime;
          } catch {
            /* seeking can throw before metadata is ready */
          }
        }
      }
      setReady(true);
      // Chrome can defer autoplay for offscreen elements, which makes tiles
      // pop into motion as they scroll in. Start every player explicitly.
      if (video.paused) void video.play().catch(() => {});
    };

    // Cached clips can already be ready before React attaches listeners, so
    // check the current state as well as listening for later loads.
    if (video.readyState >= 2) start();
    video.addEventListener("loadeddata", start);
    video.addEventListener("canplay", start);

    return () => {
      video.removeEventListener("loadeddata", start);
      video.removeEventListener("canplay", start);
      if (players.get(src) === video) players.delete(src);
    };
  }, [src]);

  if (failed) {
    return (
      <div
        aria-hidden
        className={className}
        style={{ backgroundImage: fallback }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={preload}
      onError={() => setFailed(true)}
      className={cn(
        className,
        "transition-opacity duration-300",
        ready ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
