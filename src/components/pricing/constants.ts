import { Film, Image as ImageIcon } from "lucide-react";

/** Image price breaks, shown as the slider legend. */
export const imageTiers = [
  {
    label: "1–9",
    price: "$0.07",
    start: 1,
    active: (quantity: number) => quantity < 10,
  },
  {
    label: "10–49",
    price: "$0.06",
    start: 10,
    active: (quantity: number) => quantity >= 10 && quantity < 50,
  },
  {
    label: "50–500",
    price: "$0.05",
    start: 50,
    active: (quantity: number) => quantity >= 50,
  },
];

export const orderTabs = [
  { id: "video", label: "Video", icon: Film },
  { id: "image", label: "Images", icon: ImageIcon },
] as const;

export type OrderTabId = (typeof orderTabs)[number]["id"];
