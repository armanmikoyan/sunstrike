import type { MediaKind } from "@/components/media-card/types";
import type { imageRates, topUpPacks, videoRates } from "@/mocks/pricing";
import type { getImageQuote } from "./utils";

export type ModelRate = {
  perSecond?: number;
  perImage?: number;
};

export type PricingModel = ModelRate & {
  slug: string;
  displayName: string;
};

export type GenerationKind = MediaKind;

export type ModelFilter = "all" | GenerationKind;

export type PricingModelSet = {
  videoModels: PricingModel[];
  imageModels: PricingModel[];
};

export type AmountControlProps = {
  amount: number;
  onAmountChange: (amount: number) => void;
};

export type PricingCustomTopUpProps = PricingModelSet & AmountControlProps;

export type PricingTopUpsProps = PricingModelSet;

export type PricingTopUpAmountProps = AmountControlProps;

export type PricingTopUpEstimateProps = PricingModelSet & {
  amount: number;
};

export type ModelRow =
  | { kind: "video"; model: (typeof videoRates)[number] }
  | { kind: "image"; model: (typeof imageRates)[number] };

export type SliderProps = {
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
  className?: string;
};

export type QuantitySliderProps = SliderProps & {
  ariaLabel: string;
};

export type SliderDrag = {
  pointerId: number;
  startX: number;
  startValue: number;
  travel: number;
};

export type SegmentedSliderProps = SliderProps & {
  step: number;
  label: string;
  /** Upper bound on how many ticks the strip may draw. */
  ticks?: number;
};

export type TickLayout = {
  width: number;
  ratio: number;
  /** Sub-pixel part of the track's device offset, nudged back to a whole pixel. */
  snap: number;
};

export type ImageQuote = ReturnType<typeof getImageQuote>;

export type TopUpPack = (typeof topUpPacks)[number];

export type PricingTopUpPacksProps = {
  amount: number;
  onSelect: (amount: number) => void;
};

export type PricingTopUpPackProps = {
  pack: TopUpPack;
  selected: boolean;
  onSelect: () => void;
};

export type ImageOrderQuoteProps = {
  quote: ImageQuote;
};

export type ImageOrderProps = ImageOrderQuoteProps & {
  onQuantityChange: (quantity: number) => void;
};

export type ImageOrderTierProps = {
  label: string;
  price: string;
  active: boolean;
  onSelect: () => void;
};

export type PricingModelRowProps = {
  row: ModelRow;
};
