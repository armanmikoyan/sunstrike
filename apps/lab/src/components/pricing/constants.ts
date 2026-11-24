import { imageRates, videoRates } from "@/mocks/pricing";
import type { GenerationKind, ModelFilter } from "./types";
export const MIN_IMAGES = 1;
export const MAX_IMAGES = 500;

export const PRICING_CARD_COPY = {
  yourOrder: "Your order",
  payg: "PAYG",
  images: "Images",
  imagesLower: "images",
  decreaseImages: "Decrease images",
  increaseImages: "Increase images",
  numberOfImages: "Number of images",
  imageRangeStart: "1 image",
  imageRangeEnd: `${MAX_IMAGES} images`,
  perImage: "Per image",
  imageUnit: "/ image",
  volumeSaving: "Volume saving",
  total: "Total",
  get: "Get",
  currency: "$",
  negativeCurrency: "−$",
  paymentNote: "One-time payment · No subscription",
};

/** Image price breaks, in ascending order: a tier's unit price applies from its `start`. */
export const IMAGE_TIERS = [
  { label: "1–9", start: 1, unit: 0.07 },
  { label: "10–49", start: 10, unit: 0.06 },
  { label: "50–500", start: 50, unit: 0.05 },
];

export const PRICING_POINTS = ["No monthly fee", "Balance never expires", "Commercial use"];

export const PRICING_COPY = {
  hero: {
    eyebrow: "Pay as you go",
    titleBefore: "Every ",
    titleAccent: "second",
    titleAfter: " at the model's price",
    description:
      "Video is billed by the second in US dollars. Choose a model, check its rate, and know what a 5, 6 or 12 second shot costs before you generate.",
    primaryAction: "Open video studio",
    secondaryAction: "See model rates",
  },
  topUps: {
    title: "Top-ups",
    description: "Add any amount from $5. One-time payment, no recurring charge.",
    secure: "Secure checkout · instant delivery",
    select: "Select",
    popular: "Most popular",
    currency: "$",
    balance: "Added to your balance",
    neverExpires: "Never expires",
    topUp: "Top up $",
    videos: "videos",
    images: "images",
    capacityNote: "Capacity uses the Motion 2 and Image 2 rates and rounds down to whole units.",
    custom: {
      name: "Custom top-up",
      description: "Drag the bar, use a preset, or step the amount.",
      calculatorTitle: "Top-up calculator",
      calculatorDescription: "Approximately how many videos or images your balance covers.",
      estimateLabel: "You get",
      modeLabel: "Mode",
      modelLabel: "Model",
      videoSeconds: 6,
      min: 5,
      max: 10000,
      step: 1,
      minMax: "From $5 to $10,000",
      video: "Video",
      image: "Image",
      topUp: "Top up",
      amountLabel: "Custom top-up amount",
      decreaseAmount: "Decrease amount",
      increaseAmount: "Increase amount",
    },
  },
  rates: {
    titleBefore: "Model ",
    titleAccent: "rates",
    description: "Dollar prices from the Chronolab catalogue. Video is priced per second; images are priced per image.",
    action: "Open video studio",
    filterLabel: "Model type",
    all: "All models",
    video: "Video models",
    image: "Image models",
    videoLabel: "Video",
    imageLabel: "Image",
    perSecond: "/ second",
    perImage: "/ image",
    sixSecond: "per 6-second clip",
    audio: "Native audio",
    silent: "Silent",
  },
  faq: {
    title: "Common questions",
    description: "Billing, balance and generation answers.",
  },
};

export const PRICING_FAQS = [
  {
    question: "How does billing work?",
    answer:
      "Pay as you go in US dollars. Add funds whenever you need them, and every video is charged by the second at the rate shown before you start.",
  },
  {
    question: "Is there a subscription?",
    answer:
      "No. Chronolab is pay as you go. Top up when you need to and spend the balance across image and video models at your own pace.",
  },
  {
    question: "Does my balance expire?",
    answer: "No. Your balance stays in your account until you use it, and it never expires.",
  },
  {
    question: "What happens if a generation fails?",
    answer:
      "The amount is held when a job starts and only charged when it completes. Failed generations are refunded automatically.",
  },
  {
    question: "Can I use the work commercially?",
    answer: "Yes. Every output you generate comes with a commercial license.",
  },
];

/** Scale styles applied to the shadcn slider so only the tick drum shows. */
export const SCALE_STYLES =
  "[&_[data-slot=slider-track]]:h-px [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-thumb]]:opacity-0";

export const MODEL_FILTERS: { value: ModelFilter; label: string }[] = [
  { value: "all", label: PRICING_COPY.rates.all },
  { value: "video", label: PRICING_COPY.rates.video },
  { value: "image", label: PRICING_COPY.rates.image },
];

export const TOP_UP_MODES: { value: GenerationKind; label: string }[] = [
  { value: "video", label: PRICING_COPY.topUps.custom.video },
  { value: "image", label: PRICING_COPY.topUps.custom.image },
];

export const VIDEO_ROWS = videoRates.map((model) => ({
  kind: "video" as const,
  model,
}));

export const IMAGE_ROWS = imageRates.map((model) => ({
  kind: "image" as const,
  model,
}));

export const ROWS = VIDEO_ROWS.flatMap((row, index) => {
  const image = IMAGE_ROWS[index];
  return image ? [row, image] : [row];
});

export const TICK_COUNT = 64;
export const TICK_STEP = 360 / TICK_COUNT;
export const RADIUS = 150;
export const ROTATION_SPAN = 140;
export const PERSPECTIVE = 700;

export const TICK_HEIGHT = 16;
export const TICK_WIDTH = 3;
export const TICK_RADIUS = 4;
export const PITCH = 11;
export const FILL_MS = 150;
/** Taller than the resting tick so the swell has room to grow both ways. */
export const BOX_HEIGHT = 24;
export const POP_MS = 260;
export const POP_SCALE = 1.45;

export const FILLED = [167, 139, 250] as const;
export const EMPTY = [255, 255, 255] as const;
export const EMPTY_ALPHA = 0.2;
