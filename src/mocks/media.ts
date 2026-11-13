import type { MediaCategory, MediaItem } from "@/lib/media";

export const VIDEO_VARIANTS = [
  {
    preview: "/videos/extra-time/preview.mp4",
    poster: "/videos/extra-time/poster.jpg",
  },
  {
    preview: "/videos/orange-room/preview.mp4",
    poster: "/videos/orange-room/poster.jpg",
  },
  {
    preview: "/videos/horse-rider/preview.mp4",
    poster: "/videos/horse-rider/poster.jpg",
  },
] as const;

export const IMAGE_VARIANTS = [
  "/images/freediver.png",
  "/images/shibuya.png",
  "/images/marco-valdez.png",
] as const;

const categoryFallback: Record<MediaCategory, string> = {
  Portrait:
    "linear-gradient(150deg, #262130 0%, #3a2f4b 60%, #4e4066 100%)",
  Fashion:
    "linear-gradient(150deg, #2b2428 0%, #443a47 60%, #5a4a5f 100%)",
  Abstract:
    "linear-gradient(150deg, #262130 0%, #3f3552 60%, #514060 100%)",
  City: "linear-gradient(150deg, #1e252c 0%, #2f4454 60%, #3c5568 100%)",
  Nature:
    "linear-gradient(150deg, #202823 0%, #334a3d 60%, #3f5949 100%)",
  Space: "linear-gradient(150deg, #1d1f2a 0%, #2b3050 60%, #3a3d63 100%)",
  Cinematic:
    "linear-gradient(150deg, #221f2b 0%, #352c4a 60%, #463a63 100%)",
};

const items: Omit<
  MediaItem,
  "src" | "poster" | "fallback"
>[] = [
  {
    id: "01",
    title: "Extra Time",
    prompt:
      "Footballer in black tie and dress shirt striking a ball under stadium floodlights, night match, shallow depth of field",
    kind: "video",
    category: "Fashion",
    aspect: "9 / 16",
    model: "Chronolab Motion 2",
    cost: 0.51,
    duration: "0:15",
    createdAt: "12 min ago",
  },
  {
    id: "02",
    title: "Orange Room",
    prompt:
      "Two men in tailored black and cream suits circling a suspended studio microphone against a tangerine backdrop, slow orbit",
    kind: "video",
    category: "Fashion",
    aspect: "9 / 16",
    model: "Chronolab Motion Turbo",
    cost: 0.34,
    duration: "0:30",
    createdAt: "18 min ago",
  },
  {
    id: "03",
    title: "Red Room",
    prompt:
      "Crowd in a crimson-lit club, handheld flash camera in frame, haze and hard shadows",
    kind: "video",
    category: "City",
    aspect: "9 / 16",
    model: "Chronolab Motion 2",
    cost: 0.51,
    duration: "0:30",
    createdAt: "24 min ago",
  },
  {
    id: "04",
    title: "Last Light Run",
    prompt:
      "Crimson sports coupe model on a train window ledge at golden hour, parallax city blur outside",
    kind: "video",
    category: "City",
    aspect: "9 / 16",
    model: "Chronolab Motion Turbo",
    cost: 0.34,
    duration: "0:22",
    createdAt: "38 min ago",
  },
  {
    id: "05",
    title: "Soft Object",
    prompt:
      "Iridescent ceramic form floating in pastel haze, softbox lighting, product study",
    kind: "image",
    category: "Abstract",
    aspect: "3 / 4",
    model: "Chronolab Image 2",
    cost: 0.07,
    createdAt: "44 min ago",
  },
  {
    id: "06",
    title: "Signal Fold",
    prompt:
      "Orange and teal folded paper sculpture, graphic still life, crisp shadows",
    kind: "image",
    category: "Abstract",
    aspect: "3 / 4",
    model: "Chronolab Image Pro",
    cost: 0.12,
    createdAt: "51 min ago",
  },
  {
    id: "07",
    title: "High Desert",
    prompt:
      "Man in a white shirt seated in a folding chair in a dry desert valley, warm late light, static frame",
    kind: "video",
    category: "Nature",
    aspect: "9 / 16",
    model: "Chronolab Motion 2",
    cost: 0.51,
    duration: "0:11",
    createdAt: "1 hr ago",
  },
  {
    id: "08",
    title: "Ashfield",
    prompt:
      "Armored knight on a white horse riding through a burning battlefield, embers and smoke, anamorphic cinematic",
    kind: "video",
    category: "Cinematic",
    aspect: "1 / 1",
    model: "Chronolab Motion Turbo",
    cost: 0.34,
    duration: "0:17",
    createdAt: "1 hr ago",
  },
  {
    id: "09",
    title: "Extra Time II",
    prompt:
      "Footballer in black tie and dress shirt striking a ball under stadium floodlights, night match, shallow depth of field",
    kind: "video",
    category: "Fashion",
    aspect: "9 / 16",
    model: "Chronolab Motion 2",
    cost: 0.51,
    duration: "0:15",
    createdAt: "2 hr ago",
  },
  {
    id: "10",
    title: "Lower Manhattan",
    prompt:
      "New York skyline at blue hour from the harbor, thin clouds, aerial perspective",
    kind: "image",
    category: "City",
    aspect: "3 / 4",
    model: "Chronolab Image Pro",
    cost: 0.12,
    createdAt: "2 hr ago",
  },
  {
    id: "11",
    title: "Last Light Run II",
    prompt:
      "Crimson sports coupe model on a train window ledge at golden hour, parallax city blur outside",
    kind: "video",
    category: "City",
    aspect: "9 / 16",
    model: "Chronolab Motion Turbo",
    cost: 0.34,
    duration: "0:22",
    createdAt: "3 hr ago",
  },
  {
    id: "12",
    title: "Stillwater",
    prompt:
      "Alpine lake with a timber cabin, low clouds on the ridge, muted film stock",
    kind: "image",
    category: "Nature",
    aspect: "3 / 4",
    model: "Chronolab Image 2",
    cost: 0.07,
    createdAt: "3 hr ago",
  },
  {
    id: "13",
    title: "Dusk Ridge",
    prompt:
      "Layered mountain ridges at dusk, atmospheric depth, soft peach gradient sky",
    kind: "image",
    category: "Nature",
    aspect: "3 / 4",
    model: "Chronolab Image 2",
    cost: 0.07,
    createdAt: "4 hr ago",
  },
  {
    id: "14",
    title: "Orange Room II",
    prompt:
      "Two men in tailored black and cream suits circling a suspended studio microphone against a tangerine backdrop, slow orbit",
    kind: "video",
    category: "Fashion",
    aspect: "9 / 16",
    model: "Chronolab Motion Turbo",
    cost: 0.34,
    duration: "0:30",
    createdAt: "5 hr ago",
  },
  {
    id: "15",
    title: "Deep Field",
    prompt:
      "Dense star field, faint dust lanes, deep space survey photography, cold highlights",
    kind: "image",
    category: "Space",
    aspect: "3 / 4",
    model: "Chronolab Image Pro",
    cost: 0.12,
    createdAt: "5 hr ago",
  },
  {
    id: "16",
    title: "Ashfield II",
    prompt:
      "Armored knight on a white horse riding through a burning battlefield, embers and smoke, anamorphic cinematic",
    kind: "video",
    category: "Cinematic",
    aspect: "1 / 1",
    model: "Chronolab Motion Turbo",
    cost: 0.34,
    duration: "0:17",
    createdAt: "6 hr ago",
  },
  {
    id: "17",
    title: "Chromatic Spill",
    prompt:
      "Cyan and red ink blooming in water, macro, frozen motion, rich color separation",
    kind: "image",
    category: "Abstract",
    aspect: "3 / 4",
    model: "Chronolab Image Pro",
    cost: 0.12,
    createdAt: "7 hr ago",
  },
  {
    id: "18",
    title: "Ember Study",
    prompt:
      "Abstract oil painting in saffron, vermilion and teal, heavy texture, gallery light",
    kind: "image",
    category: "Abstract",
    aspect: "3 / 4",
    model: "Chronolab Image 2",
    cost: 0.07,
    createdAt: "8 hr ago",
  },
];

let imageIndex = 0;

export const mediaItems: MediaItem[] = items.map((item, index) => {
  const video = VIDEO_VARIANTS[index % VIDEO_VARIANTS.length];
  const image = IMAGE_VARIANTS[imageIndex++ % IMAGE_VARIANTS.length];
  const isVideo = item.kind === "video";
  return {
    ...item,
    src: isVideo ? video.preview : image,
    poster: isVideo ? video.poster : image,
    fallback: categoryFallback[item.category],
  };
});

export const mediaById = (id: string) =>
  mediaItems.find((item) => item.id === id);
