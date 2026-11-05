import type { ComponentProps } from "react";

export type VideoWithFallbackProps = {
  src: string;
  poster?: string;
  fallback: string;
  className?: string;
  preload?: ComponentProps<"video">["preload"];
};
