import type { MediaKind } from "@/components/media-card/types";
import type { ModelOption, OfferingsStatus } from "@/components/studio/types";
import type { topUpPacks } from "@/mocks/pricing";

export type GenerationKind = MediaKind;

export type ModelFilter = "all" | GenerationKind;

export type PricingModelSet = {
  videoModels: ModelOption[];
  imageModels: ModelOption[];
};

export type PricingModels = PricingModelSet & {
  status: OfferingsStatus;
};

export type AmountControlProps = {
  amount: number;
  onAmountChange: (amount: number) => void;
};

export type PricingCustomTopUpProps = PricingModelSet & AmountControlProps;

export type PricingTopUpAmountProps = AmountControlProps;

export type PricingTopUpEstimateProps = PricingModelSet & {
  amount: number;
};

export type ModelRow = {
  kind: GenerationKind;
  model: ModelOption;
};

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
  ticks?: number;
};

export type TickLayout = {
  width: number;
  ratio: number;
  snap: number;
};

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

export type PricingModelRowProps = {
  row: ModelRow;
};
