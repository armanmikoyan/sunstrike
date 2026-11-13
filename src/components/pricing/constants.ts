import { MAX_IMAGES } from "@/lib/pricing";

export const pricingCardCopy = {
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

export const pricingPoints = [
  "No monthly fee",
  "Balance never expires",
  "Commercial use",
];

export const pricingCopy = {
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
    description:
      "Add any amount from $5. One-time payment, no recurring charge.",
    secure: "Secure checkout · instant delivery",
    popular: "Most popular",
    oneTime: "one time",
    currency: "$",
    balance: "Added to your balance",
    neverExpires: "Never expires",
    topUp: "Top up $",
    upTo: "Up to",
    seconds: "seconds",
    videos: "videos",
    images: "images",
    capacityNote:
      "Capacity uses the Motion 2 and Image 2 rates and rounds down to whole units.",
    custom: {
      name: "Custom top-up",
      description: "Use the buttons, slider, or a preset.",
      modeLabel: "Mode",
      modelLabel: "Model",
      videoSeconds: 6,
      min: 5,
      max: 10000,
      step: 5,
      minMax: "From $5 to $10,000",
      video: "Video",
      image: "Image",
      topUp: "Top up",
      amountLabel: "Custom top-up amount",
      decreaseAmount: "Decrease amount",
      increaseAmount: "Increase amount",
      presets: [20, 50, 100, 250],
    },
  },
  rates: {
    titleBefore: "Model ",
    titleAccent: "rates",
    description:
      "Dollar prices from the Chronolab catalogue. Video is priced per second; images are priced per image.",
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

export const pricingFaqs = [
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
    answer:
      "No. Your balance stays in your account until you use it, and it never expires.",
  },
  {
    question: "What happens if a generation fails?",
    answer:
      "The amount is held when a job starts and only charged when it completes. Failed generations are refunded automatically.",
  },
  {
    question: "Can I use the work commercially?",
    answer:
      "Yes. Every output you generate comes with a commercial license.",
  },
];
