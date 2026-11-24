"use client";

import { cn } from "cn";
import { useVideoPlayer } from "./hooks";
import type { VideoWithFallbackProps } from "./types";

export function VideoWithFallback({ src, poster, fallback, className, preload = "metadata" }: VideoWithFallbackProps) {
  const { videoRef, failed, setFailed, ready } = useVideoPlayer(src);

  if (failed) {
    return <div aria-hidden className={className} style={{ backgroundImage: fallback }} />;
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
      className={cn(className, "transition-opacity duration-300", ready ? "opacity-100" : "opacity-0")}
    />
  );
}
