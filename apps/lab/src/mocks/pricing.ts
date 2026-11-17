import { modelOptions } from "./generation";

const videoSecondPrices: Record<string, number> = {
  "chronolab-motion-2": 0.085,
  seedance: 0.09,
  "chronolab-motion-turbo": 0.085,
  "chronolab-camera": 0.1,
  "chronolab-loop": 0.072,
};

const videoSummaries: Record<string, string> = {
  "chronolab-motion-2": "Native audio and longer takes for finished shots.",
  seedance: "Natural motion and strong prompt adherence.",
  "chronolab-motion-turbo": "Fast drafts and short motion tests.",
  "chronolab-camera": "Controlled camera moves and cinematic framing.",
  "chronolab-loop": "Seamless loops for social and product spins.",
};

export const videoRates = modelOptions.video.map((model) => ({
  ...model,
  perSecond: videoSecondPrices[model.slug] ?? 0,
  summary: videoSummaries[model.slug] ?? "",
}));

const imageSummaries: Record<string, string> = {
  "chronolab-image-2": "Everyday images at 1 megapixel.",
  "chronolab-image-pro": "Sharper 2 MP images for final frames.",
  "chronolab-image-raw": "4 MP detail for print and crop.",
  "chronolab-product": "Studio product frames at 2 MP.",
};

export const imageRates = modelOptions.image.map((model) => ({
  ...model,
  perImage: model.cost,
  summary: imageSummaries[model.slug] ?? "",
}));

// Accents stay in the brand's cool range (violet to cyan) so the row reads as
// one family. The prices double as the range marks on the custom bar, and the
// popular pack is selected when the page loads.
export const topUpPacks = [
  { id: "five", price: 5, note: "A few shots", accent: "#8b5cf6" },
  {
    id: "fifty",
    price: 50,
    note: "Viral reels every day",
    accent: "#6366f1",
    popular: true,
  },
  { id: "two-fifty", price: 250, note: "Ad campaign", accent: "#0ea5e9" },
  { id: "thousand", price: 1000, note: "Full production", accent: "#14b8a6" },
  { id: "five-thousand", price: 5000, note: "Full movie", accent: "#22c55e" },
  {
    id: "ten-thousand",
    price: 10000,
    note: "Billionaire era",
    accent: "#a3e635",
  },
];
