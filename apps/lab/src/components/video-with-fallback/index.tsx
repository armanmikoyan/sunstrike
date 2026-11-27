"use client";

import { cn } from "cn";
import { useVideoPlayer } from "./hooks";
import type { VideoWithFallbackProps } from "./types";

export function VideoWithFallback({ src, poster, fallback, className, preload = "none" }: VideoWithFallbackProps) {
  const { videoRef, failed, setFailed, ready } = useVideoPlayer();

  if (failed) {
    return <div aria-hidden className={className} style={{ backgroundImage: fallback }} />;
  }

  // The poster paints underneath, so a slow clip never fades in from a blank
  // box; only the video itself crossfades once it has data.
  return (
    <div
      className={cn(className, "overflow-hidden")}
      style={
        poster
          ? { backgroundImage: `url(${poster})`, backgroundPosition: "center", backgroundSize: "cover" }
          : undefined
      }
    >
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
        className={cn("size-full object-cover transition-opacity duration-200", ready ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
