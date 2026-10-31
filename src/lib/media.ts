export type MediaKind = "video" | "image";
export type MediaCategory =
  | "Portrait"
  | "Fashion"
  | "Abstract"
  | "City"
  | "Nature"
  | "Space"
  | "Cinematic";

export type MediaItem = {
  id: string;
  title: string;
  prompt: string;
  kind: MediaKind;
  category: MediaCategory;
  src: string;
  poster: string;
  aspect: string;
  model: string;
  author: string;
  likes: number;
  cost: number;
  duration?: string;
  createdAt: string;
  fallback: string;
};

const categoryFallback: Record<MediaCategory, string> = {
  Portrait:
    "linear-gradient(150deg, #2c2226 0%, #4b3036 60%, #63383e 100%)",
  Fashion:
    "linear-gradient(150deg, #2b241f 0%, #4f3d2c 60%, #6b4a32 100%)",
  Abstract:
    "linear-gradient(150deg, #262130 0%, #3f3552 60%, #514060 100%)",
  City: "linear-gradient(150deg, #1e252c 0%, #2f4454 60%, #3c5568 100%)",
  Nature:
    "linear-gradient(150deg, #202823 0%, #334a3d 60%, #3f5949 100%)",
  Space: "linear-gradient(150deg, #1d1f2a 0%, #2b3050 60%, #3a3d63 100%)",
  Cinematic:
    "linear-gradient(150deg, #2a211c 0%, #4e3427 60%, #66402c 100%)",
};

const items: (Omit<MediaItem, "src" | "poster" | "fallback"> & {
  clip?: string;
})[] = [
  {
    id: "01",
    title: "Extra Time",
    prompt:
      "Footballer in black tie and dress shirt striking a ball under stadium floodlights, night match, shallow depth of field",
    kind: "video",
    category: "Fashion",
    aspect: "9 / 16",
    model: "Sunstrike Motion 2",
    author: "Mara Lune",
    likes: 842,
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
    model: "Sunstrike Motion Turbo",
    author: "Studio Kova",
    likes: 1204,
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
    model: "Sunstrike Motion 2",
    author: "Noah A.",
    likes: 673,
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
    model: "Sunstrike Motion Turbo",
    author: "Sena Ito",
    likes: 2190,
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
    model: "Sunstrike Image 2",
    author: "Field Office",
    likes: 473,
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
    model: "Sunstrike Image Pro",
    author: "Iris M.",
    likes: 318,
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
    model: "Sunstrike Motion 2",
    author: "Mara Lune",
    likes: 956,
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
    model: "Sunstrike Motion Turbo",
    author: "Studio Kova",
    likes: 731,
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
    model: "Sunstrike Motion 2",
    author: "Mara Lune",
    likes: 3402,
    cost: 0.51,
    duration: "0:15",
    createdAt: "2 hr ago",
    clip: "01",
  },
  {
    id: "10",
    title: "Lower Manhattan",
    prompt:
      "New York skyline at blue hour from the harbor, thin clouds, aerial perspective",
    kind: "image",
    category: "City",
    aspect: "3 / 4",
    model: "Sunstrike Image Pro",
    author: "Noah A.",
    likes: 1871,
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
    model: "Sunstrike Motion Turbo",
    author: "Sena Ito",
    likes: 2688,
    cost: 0.34,
    duration: "0:22",
    createdAt: "3 hr ago",
    clip: "04",
  },
  {
    id: "12",
    title: "Stillwater",
    prompt:
      "Alpine lake with a timber cabin, low clouds on the ridge, muted film stock",
    kind: "image",
    category: "Nature",
    aspect: "3 / 4",
    model: "Sunstrike Image 2",
    author: "Iris M.",
    likes: 945,
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
    model: "Sunstrike Image 2",
    author: "Mara Lune",
    likes: 622,
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
    model: "Sunstrike Motion Turbo",
    author: "Studio Kova",
    likes: 4121,
    cost: 0.34,
    duration: "0:30",
    createdAt: "5 hr ago",
    clip: "02",
  },
  {
    id: "15",
    title: "Deep Field",
    prompt:
      "Dense star field, faint dust lanes, deep space survey photography, cold highlights",
    kind: "image",
    category: "Space",
    aspect: "3 / 4",
    model: "Sunstrike Image Pro",
    author: "Noah A.",
    likes: 1107,
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
    model: "Sunstrike Motion Turbo",
    author: "Studio Kova",
    likes: 2954,
    cost: 0.34,
    duration: "0:17",
    createdAt: "6 hr ago",
    clip: "08",
  },
  {
    id: "17",
    title: "Chromatic Spill",
    prompt:
      "Cyan and red ink blooming in water, macro, frozen motion, rich color separation",
    kind: "image",
    category: "Abstract",
    aspect: "3 / 4",
    model: "Sunstrike Image Pro",
    author: "Field Office",
    likes: 859,
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
    model: "Sunstrike Image 2",
    author: "Iris M.",
    likes: 704,
    cost: 0.07,
    createdAt: "8 hr ago",
  },
];

export const mediaItems: MediaItem[] = items.map((item) => {
  const { clip, ...rest } = item;
  const file = clip ?? item.id;
  return {
    ...rest,
    src: `/media/${file}.${item.kind === "video" ? "mp4" : "jpg"}`,
    poster: `/media/${file}.jpg`,
    fallback: categoryFallback[item.category],
  };
});

export const mediaById = (id: string) =>
  mediaItems.find((item) => item.id === id);

export const heroMedia = mediaItems.filter((item) =>
  ["01", "02", "03", "04", "05", "07", "08", "09", "10", "11", "14", "16", "17", "18", "12"].includes(
    item.id,
  ),
);

export const mediaCategories: ("All" | MediaCategory)[] = [
  "All",
  "Portrait",
  "Fashion",
  "Abstract",
  "City",
  "Nature",
  "Space",
  "Cinematic",
];

export const topUpPacks = [
  {
    id: "starter",
    name: "Starter",
    price: 10,
    note: "For a quick round of tests",
    popular: false,
  },
  {
    id: "studio",
    name: "Studio",
    price: 25,
    note: "For weekly client work",
    popular: true,
  },
  {
    id: "production",
    name: "Production",
    price: 50,
    note: "For teams shipping daily",
    popular: false,
  },
];

export const generationRates = [
  {
    name: "Motion turbo",
    detail: "Sunstrike Motion Turbo · 4 seconds",
    price: "$0.34",
  },
  {
    name: "Motion standard",
    detail: "Sunstrike Motion 2 · 6 seconds",
    price: "$0.51",
  },
  {
    name: "Still image",
    detail: "Sunstrike Image 2 · 1 megapixel",
    price: "$0.07",
  },
  {
    name: "Still image pro",
    detail: "Sunstrike Image Pro · 2 megapixels",
    price: "$0.12",
  },
];
