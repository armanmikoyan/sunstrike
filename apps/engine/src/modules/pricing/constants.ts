export const QUOTE_KINDS = ["create", "edit"] as const;

export const CURRENCY = "USD";

/** Video is sold by the second, images by the image. */
export const PRICE_UNITS = {
  video: "per_second",
  image: "per_image",
} as const;

export const MAX_QUOTE_QUANTITY = 500;

/** Length of the example clip each video rate is priced at. */
export const EXAMPLE_VIDEO_SECONDS = 6;
