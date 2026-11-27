import type { ComponentProps } from "react";

export type VideoWallTileProps = {
  id: string;
  live: boolean;
  preload: ComponentProps<"video">["preload"];
};
