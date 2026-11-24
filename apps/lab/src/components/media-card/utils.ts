import type { MediaFilter, MediaItem, MediaSearchField } from "./types";

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

export function filterMedia(
  items: readonly MediaItem[],
  filter: MediaFilter,
  query = "",
  fields: readonly MediaSearchField[] = [],
): MediaItem[] {
  const normalized = query.trim().toLowerCase();

  return items.filter(
    (item) =>
      (filter === "all" || item.kind === filter) &&
      (!normalized || fields.some((field) => item[field].toLowerCase().includes(normalized))),
  );
}
