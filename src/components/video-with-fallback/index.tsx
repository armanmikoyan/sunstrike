"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { VideoWithFallbackProps } from "./types";

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
}: VideoWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
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

  // Only decode clips that are on screen. The wall repeats columns for its
  // loop and the grids keep many players mounted, so playing them all at once
  // stalls lower-end machines.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return;

    if (inView) {
      if (video.paused) void video.play()?.catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, ready]);

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
