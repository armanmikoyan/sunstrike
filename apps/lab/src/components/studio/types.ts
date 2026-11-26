import type { ReactNode } from "react";
import type { MediaKind } from "@/components/media-card/types";
import type { FieldProps } from "@/components/settings/types";
import type { useStudio } from "./hooks";

export type GenerationMode = MediaKind;

export type ModelInputKind = "image" | "video" | "audio";

export type PriceUnit = "per_second" | "per_image";

export type ModelCapabilities = {
  modes: GenerationMode[];
  inputs: ModelInputKind[];
  resolutions: string[];
  durationsSeconds: number[];
  aspectRatios: string[];
  audio: boolean;
};

export type ModelVendor = {
  id: string;
  name: string;
  logoUrl: string | null;
};

/** One entry of `GET /api/offerings`: a model a customer can use now, with its selling price. */
export type Offering = {
  model: {
    id: string;
    slug: string;
    name: string;
    summary: string;
    vendor: ModelVendor | null;
    capabilities: ModelCapabilities;
  };
  price: {
    unit: PriceUnit;
    unitPriceMicros: number;
    rules: {
      tiers: { minQuantity: number; unitPriceMicros: number }[];
      resolutionMultipliers: Record<string, number>;
      audioMultiplier: number;
      discountPercent: number;
    };
    example: { units: number; totalMicros: number };
    currency: string;
  };
};

/** From `minQuantity` outputs upward, each output costs `unitPrice` dollars. */
export type VolumeTier = {
  minQuantity: number;
  unitPrice: number;
};

export type OfferingsResponse = {
  offerings: Offering[];
};

export type OfferingsStatus = "loading" | "ready" | "failed";

export type OfferingsState = {
  status: OfferingsStatus;
  models: ModelOption[];
};

export type QuoteRequest = {
  modelId: string;
  mode: GenerationMode;
  resolution: string;
  aspectRatio: string;
  durationSeconds: number | null;
  audio: boolean;
};

export type QuoteResponse = {
  quote: {
    totalMicros: number;
  };
};

export type Template = {
  id: string;
  sourceAssetId: string;
  name: string;
  customizationOptions: Record<string, unknown>;
  createdAt: string;
};

export type ModelOption = {
  id: string;
  slug: string;
  displayName: string;
  summary: string;
  vendor: ModelVendor | null;
  capabilities: ModelCapabilities;
  unit: PriceUnit;
  unitPrice: number;
  /** True when resolution or audio raise the price above `unitPrice`. */
  priceVaries: boolean;
  tiers: VolumeTier[];
  example: { units: number; total: number };
};

/** The last quoted total in dollars; `pending` while a newer quote is on its way. */
export type Quote = {
  total: number | null;
  pending: boolean;
};

export type StudioCostProps = {
  cost: Quote;
};

export type StudioDurationSliderProps = {
  options: number[];
  value: number;
  onValueChange: (seconds: number) => void;
  label: string;
  className?: string;
};

export type StudioDurationMenuProps = StudioDurationSliderProps & {
  /** Styling for the menu panel around the track. */
  contentClassName?: string;
  /** Whether the menu repeats the label above the track. */
  menuLabel?: boolean;
};

export type StudioSkeletonLineProps = {
  width: string;
  className?: string;
};

export type StudioWorkspaceProps = StudioProps & {
  models: ModelOption[];
  selectedModel: ModelOption;
};

export type StudioHeaderProps = {
  mode: GenerationMode;
  credits: number;
};

export type StudioProps = {
  initialMode: GenerationMode;
};

export type StudioState = ReturnType<typeof useStudio>;

export type StudioScopedProps = {
  studio: StudioState;
};

export type StudioPreviewProps = StudioScopedProps & {
  children?: ReactNode;
};

export type StudioFieldProps = Pick<FieldProps, "label" | "children">;

export type StudioSelectOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  hint?: ReactNode;
};

export type StudioModelLogoProps = {
  vendor: ModelVendor | null;
  className?: string;
};

export type StudioSelectFieldProps = {
  label: string;
  value: string;
  options: StudioSelectOption[];
  onChange: (value: string) => void;
};
