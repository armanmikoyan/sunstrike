import type { MediaItem } from "./types";

export function mixMediaByKind(items: readonly MediaItem[]): MediaItem[] {
  const videos = items.filter((item) => item.kind === "video");
  const images = items.filter((item) => item.kind === "image");
  const mixed: MediaItem[] = [];

  for (let index = 0; index < Math.max(videos.length, images.length); index++) {
    if (videos[index]) mixed.push(videos[index]);
    if (images[index]) mixed.push(images[index]);
  }

  return mixed;
}
