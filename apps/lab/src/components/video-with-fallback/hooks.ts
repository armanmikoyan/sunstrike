"use client";

import { useEffect, useRef, useState } from "react";
import { PLAYERS } from "./constants";

export function useVideoPlayer(src: string) {
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
        const primary = PLAYERS.get(src);
        if (!primary || primary === video) {
          PLAYERS.set(src, video);
        } else if (Number.isFinite(primary.currentTime)) {
          try {
            video.currentTime = primary.currentTime;
          } catch {}
        }
      }
      setReady(true);
    };

    if (video.readyState >= 2) start();
    video.addEventListener("loadeddata", start);
    video.addEventListener("canplay", start);

    return () => {
      video.removeEventListener("loadeddata", start);
      video.removeEventListener("canplay", start);
      if (PLAYERS.get(src) === video) PLAYERS.delete(src);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
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

  return { videoRef, failed, setFailed, ready };
}
