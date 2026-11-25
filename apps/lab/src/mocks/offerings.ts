import type { Offering, OfferingsResponse, QuoteResponse } from "@/components/studio/types";

const VIDEO_ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"];
const STILL_ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4"];

/** Engine replies for tests and e2e runs that have no engine; mirrors the seeded catalog and prices. */
export const offerings: Offering[] = [
  {
    model: {
      id: "5b0c4f0e-7d1a-4d0e-9c61-1f2a3b4c5d01",
      slug: "chronolab-motion-2",
      name: "Chronolab Motion 2",
      summary: "Native audio and longer takes for finished shots.",
      capabilities: {
        modes: ["video"],
        inputs: ["image", "video"],
        resolutions: ["720p", "1080p"],
        durationsSeconds: [4, 5, 6, 8, 12],
        aspectRatios: VIDEO_ASPECTS,
        audio: true,
      },
    },
    price: { unit: "per_second", unitPriceMicros: 85_000, currency: "USD" },
  },
  {
    model: {
      id: "5b0c4f0e-7d1a-4d0e-9c61-1f2a3b4c5d02",
      slug: "seedance",
      name: "Seedance",
      summary: "Natural motion and strong prompt adherence.",
      capabilities: {
        modes: ["video"],
        inputs: ["image", "video"],
        resolutions: ["1080p"],
        durationsSeconds: [5, 6, 10],
        aspectRatios: ["16:9", "9:16", "1:1"],
        audio: false,
      },
    },
    price: { unit: "per_second", unitPriceMicros: 90_000, currency: "USD" },
  },
  {
    model: {
      id: "5b0c4f0e-7d1a-4d0e-9c61-1f2a3b4c5d06",
      slug: "chronolab-image-2",
      name: "Chronolab Image 2",
      summary: "Everyday images at 1 megapixel.",
      capabilities: {
        modes: ["image"],
        inputs: ["image"],
        resolutions: ["1 MP"],
        durationsSeconds: [],
        aspectRatios: STILL_ASPECTS,
        audio: false,
      },
    },
    price: { unit: "per_image", unitPriceMicros: 70_000, currency: "USD" },
  },
  {
    model: {
      id: "5b0c4f0e-7d1a-4d0e-9c61-1f2a3b4c5d07",
      slug: "chronolab-image-pro",
      name: "Chronolab Image Pro",
      summary: "Sharper 2 MP images for final frames.",
      capabilities: {
        modes: ["image"],
        inputs: ["image"],
        resolutions: ["2 MP"],
        durationsSeconds: [],
        aspectRatios: STILL_ASPECTS,
        audio: false,
      },
    },
    price: { unit: "per_image", unitPriceMicros: 120_000, currency: "USD" },
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
