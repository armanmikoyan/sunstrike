import { Film, Image as ImageIcon } from "lucide-react";
import { MAX_CLIPS, MAX_IMAGES } from "@/lib/pricing";

export const pricingCardCopy = {
  yourOrder: "Your order",
  payg: "PAYG",
  images: "Images",
  imagesLower: "images",
  clips: "Clips",
  clipsLower: "clips",
  decreaseImages: "Decrease images",
  increaseImages: "Increase images",
  decreaseClips: "Decrease clips",
  increaseClips: "Increase clips",
  numberOfImages: "Number of images",
  numberOfClips: "Number of clips",
  imageRangeStart: "1 image",
  imageRangeEnd: `${MAX_IMAGES} images`,
  clipRangeStart: "1 clip",
  clipRangeEnd: `${MAX_CLIPS} clips`,
  perImage: "Per image",
  perClip: "Per clip",
  imageUnit: "/ image",
  clipUnit: "/ clip",
  volumeSaving: "Volume saving",
  total: "Total",
  get: "Get",
  currency: "$",
  negativeCurrency: "−$",
  paymentNote: "One-time payment · No subscription",
  orderTabsLabel: "What do you want to make?",
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

export const orderTabs = [
  { id: "video", label: "Video", icon: Film },
  { id: "image", label: "Images", icon: ImageIcon },
] as const;

export type OrderTabId = (typeof orderTabs)[number]["id"];

export const pricingClipIds = ["01", "02", "03", "04", "07", "08"];

export const pricingPoints = [
  "No monthly fee",
  "Balance never expires",
  "Commercial use",
];

export const pricingIntro = [
  { text: "One balance for stills and motion — clips from " },
  { text: "$0.34", emphasis: true },
  { text: ", stills from " },
  { text: "$0.07", emphasis: true },
  {
    text: ". Top up from $10, see the exact cost of every render before you start, and keep what you don't spend.",
  },
];

export const pricingCopy = {
  hero: {
    eyebrow: "Pay as you go",
    title: "Pay for output",
    titleAccent: "Not seats",
  },
  topUps: {
    title: "Top-ups",
    description:
      "Buy any amount from $10. One-time payment, no recurring charge.",
    secure: "Secure checkout · instant delivery",
    popular: "Most popular",
    oneTime: "one time",
    currency: "$",
    balance: "Added to your balance",
    neverExpires: "Never expires",
    topUp: "Top up $",
  },
  rates: {
    title: "What a render costs",
    description: "Exact price per render, before you hit generate.",
    perRender: "per render",
    refundNote: "Failed renders are refunded automatically.",
    action: "Start a render",
  },
  autoTopUp: {
    title: "Auto top-up, on your terms",
    description:
      "Set a floor and a pack size. Chronolab refills your balance only when it drops below your threshold. Switch it off whenever you want.",
    balanceBelow: "Balance below",
    balanceValue: "$5",
    topUpWith: "Top up with",
    topUpValue: "$10",
    action: "Configure auto top-up",
  },
  faq: {
    title: "Common questions",
  },
};

export const pricingFaqs = [
  {
    question: "How does billing work?",
    answer:
      "Pay as you go in US dollars. Add funds whenever you need them, and every render is charged at the price shown in the composer before you start.",
  },
  {
    question: "Is there a subscription?",
    answer:
      "No. Chronolab is pay as you go. Top up when you need to and spend the balance across image and video models at your own pace.",
  },
  {
    question: "Does my balance expire?",
    answer:
      "No. Your balance stays in your studio account until you use it. Auto top-up is optional and can be switched off at any time.",
  },
  {
    question: "What happens if a render fails?",
    answer:
      "The amount is held when a job starts and only charged when it completes. Failed renders are refunded automatically.",
  },
  {
    question: "Can I use the work commercially?",
    answer:
      "Yes. Every output you generate on a paid plan comes with a commercial license. Teams can add a shared workspace from the billing page.",
  },
];
