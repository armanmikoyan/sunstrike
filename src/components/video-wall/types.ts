import type { ComponentProps } from "react";

export type VideoWallTileProps = {
  id: string;
  preload: ComponentProps<"video">["preload"];
};
