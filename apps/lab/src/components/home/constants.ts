import { mediaById } from "@/mocks/media";

export const FEATURED_IDS = ["02", "09", "14", "17"];

export const PRICING_POINTS = ["No subscription", "Balance never expires", "Cost shown up front"];

export const PRICING_MOSAIC_TILES = [
  {
    id: "01",
    label: "16:9",
    span: "col-span-2 row-span-2 lg:col-span-6 lg:row-span-2",
  },
  { id: "05", label: "3:4", span: "col-span-1 lg:col-span-3 lg:row-span-2" },
  { id: "08", label: "1:1", span: "col-span-1 lg:col-span-3" },
  { id: "10", label: "4:3", span: "col-span-1 lg:col-span-3" },
  { id: "12", label: "9:16", span: "col-span-1 lg:col-span-2 lg:row-span-2" },
  { id: "15", label: "21:9", span: "col-span-1 lg:col-span-4" },
  { id: "17", label: "3:4", span: "col-span-1 lg:col-span-3 lg:row-span-2" },
  { id: "18", label: "1:1", span: "col-span-1 lg:col-span-3" },
  { id: "02", label: "16:9", span: "col-span-1 lg:col-span-4" },
  { id: "07", label: "4:3", span: "col-span-2 lg:col-span-3" },
];

export const HOME_COPY = {
  gallery: {
    titleBefore: "Explore the inside of every ",
    titleAccent: "frame",
    description: "See the prompt, model, and settings behind each piece.",
    action: "Open gallery",
  },
  pricing: {
    titleBefore: "Pay for the ",
    titleAccent: "output",
    titleAfter: ", not the plan",
    description:
      "Top up once and spend the balance across every image and video model. No monthly plan, no seat minimum, and nothing expires.",
    primaryAction: "See pricing",
    secondaryAction: "Billing dashboard",
    resultsTitle: "Results, priced up front",
    resultsDescription: "A few outputs across every ratio, with the cost shown.",
    resultsAction: "Open gallery",
  },
};

export const FEATURED = FEATURED_IDS.map((id) => mediaById(id)).filter((item) => item !== undefined);
