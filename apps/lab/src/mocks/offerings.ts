import type { Offering, OfferingsResponse, QuoteResponse } from "@/components/studio/types";

type Rules = Offering["price"]["rules"];

const VIDEO_ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"];
const STILL_ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4"];

const NO_RULES: Rules = { tiers: [], resolutionMultipliers: {}, audioMultiplier: 1, discountPercent: 0 };
const EXAMPLE_VIDEO_SECONDS = 6;

function price(
  unit: Offering["price"]["unit"],
  unitPriceMicros: number,
  rules: Partial<Rules> = {},
): Offering["price"] {
  const units = unit === "per_second" ? EXAMPLE_VIDEO_SECONDS : 1;

  return {
    unit,
    unitPriceMicros,
    rules: { ...NO_RULES, ...rules },
    example: { units, totalMicros: unitPriceMicros * units },
    currency: "USD",
  };
}

const CHRONOLAB = { id: "chronolab", name: "Chronolab", logoUrl: null };
const BYTEDANCE = { id: "bytedance", name: "ByteDance", logoUrl: null };

/** Engine-shaped offerings for tests and e2e runs that have no engine. */
export const offerings: Offering[] = [
  {
    model: {
      id: "5b0c4f0e-7d1a-4d0e-9c61-1f2a3b4c5d01",
      slug: "chronolab-motion-2",
      name: "Chronolab Motion 2",
      summary: "Native audio and longer takes for finished shots.",
      vendor: CHRONOLAB,
      capabilities: {
        modes: ["video"],
        inputs: ["image", "video"],
        resolutions: ["720p", "1080p"],
        durationsSeconds: [4, 5, 6, 8, 12],
        aspectRatios: VIDEO_ASPECTS,
        audio: true,
      },
    },
    price: price("per_second", 85_000, { resolutionMultipliers: { "1080p": 1.5 } }),
  },
  {
    model: {
      id: "5b0c4f0e-7d1a-4d0e-9c61-1f2a3b4c5d02",
      slug: "seedance",
      name: "Seedance",
      summary: "Natural motion and strong prompt adherence.",
      vendor: BYTEDANCE,
      capabilities: {
        modes: ["video"],
        inputs: ["image", "video"],
        resolutions: ["1080p"],
        durationsSeconds: [5, 6, 10],
        aspectRatios: ["16:9", "9:16", "1:1"],
        audio: false,
      },
    },
    price: price("per_second", 90_000),
  },
  {
    model: {
      id: "5b0c4f0e-7d1a-4d0e-9c61-1f2a3b4c5d06",
      slug: "chronolab-image-2",
      name: "Chronolab Image 2",
      summary: "Everyday images at 1 megapixel.",
      vendor: CHRONOLAB,
      capabilities: {
        modes: ["image"],
        inputs: ["image"],
        resolutions: ["1 MP"],
        durationsSeconds: [],
        aspectRatios: STILL_ASPECTS,
        audio: false,
      },
    },
    price: price("per_image", 70_000, {
      tiers: [
        { minQuantity: 10, unitPriceMicros: 60_000 },
        { minQuantity: 50, unitPriceMicros: 50_000 },
      ],
    }),
  },
  {
    model: {
      id: "5b0c4f0e-7d1a-4d0e-9c61-1f2a3b4c5d07",
      slug: "chronolab-image-pro",
      name: "Chronolab Image Pro",
      summary: "Sharper 2 MP images for final frames.",
      vendor: null,
      capabilities: {
        modes: ["image"],
        inputs: ["image"],
        resolutions: ["2 MP"],
        durationsSeconds: [],
        aspectRatios: STILL_ASPECTS,
        audio: false,
      },
    },
    price: price("per_image", 120_000),
  },
];

export const offeringsResponse: OfferingsResponse = { offerings };

/** A flat quote: the unit price times seconds for video, once for an image. */
export function quoteResponse(search: string): QuoteResponse | null {
  const params = new URLSearchParams(search);
  const offering = offerings.find((item) => item.model.id === params.get("modelId"));

  if (!offering) return null;

  const units = offering.price.unit === "per_second" ? Number(params.get("durationSeconds") ?? 0) : 1;

  return { quote: { totalMicros: offering.price.unitPriceMicros * units } };
}
