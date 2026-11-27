"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export function useVideoPlayer() {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  // Wait for the observer before playing. Starting `true` made every tile on
  // the wall begin streaming on mount, including the offscreen loop copies.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reveal the clip once it has a frame. Never seek: the wall repeats a few
    // clips across many tiles, and a seek makes each element fetch its own
    // byte ranges instead of sharing one download.
    const start = () => setReady(true);

    if (video.readyState >= 2) start();
    video.addEventListener("loadeddata", start);
    video.addEventListener("canplay", start);

    return () => {
      video.removeEventListener("loadeddata", start);
      video.removeEventListener("canplay", start);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;

    // Strict visibility: a clip that is off screen must not keep a stream open
    // for the six-connection budget other requests need.
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "0px",
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const sync = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const style = getComputedStyle(video);
    const hidden = style.display === "none" || style.visibility === "hidden";
    const allowed = !reduceMotion && document.visibilityState !== "hidden" && inView && !hidden;

    if (!allowed) {
      video.pause();
      return;
    }

    // `preload="none"` means nothing has loaded yet: play() is what starts the
    // fetch, and `loadeddata` then reveals the clip over its poster.
    if (video.paused) void video.play()?.catch(() => {});
  }, [inView, reduceMotion]);

  useEffect(() => {
    sync();
  }, [sync]);

  // Tabs and route commits can hide a player without the observer firing.
  useEffect(() => {
    const onSync = () => sync();

    document.addEventListener("visibilitychange", onSync);
    window.addEventListener("wildscape:media-resync", onSync);

    return () => {
      document.removeEventListener("visibilitychange", onSync);
      window.removeEventListener("wildscape:media-resync", onSync);
    };
  }, [sync]);

  return { videoRef, failed, setFailed, ready };
}
