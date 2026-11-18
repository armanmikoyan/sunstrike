import { mediaById } from "@/mocks/media";

export const FAVORITE_IDS = ["02", "07", "09", "10", "14", "16", "17", "11"];

export const FAVORITES_COPY = {
  eyebrow: "Saved",
  title: "Favorites",
  description: "Frames you have kept close. Open one in the studio and use it as a reference.",
  openInStudio: "Open in studio",
};

export const FAVORITES = FAVORITE_IDS.map((id) => mediaById(id)).filter((item) => item !== undefined);
