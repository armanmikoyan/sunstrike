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

export const topUpPacks = [
  {
    id: "starter",
    name: "Starter",
    price: 10,
    note: "Short tests and first drafts",
    popular: false,
  },
  {
    id: "studio",
    name: "Studio",
    price: 25,
    note: "Weekly client work and repeat jobs",
    popular: true,
  },
  {
    id: "production",
    name: "Production",
    price: 50,
    note: "Daily output and larger projects",
    popular: false,
  },
];
