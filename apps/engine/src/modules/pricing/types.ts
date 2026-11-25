import type { GenerationMode, GenerationSettingsInput } from "@/modules/catalog";
import type { CURRENCY, PRICE_UNITS, QUOTE_KINDS } from "./constants";

export type QuoteKind = (typeof QUOTE_KINDS)[number];

export type PriceUnit = (typeof PRICE_UNITS)[GenerationMode];

export type Currency = typeof CURRENCY;

/** From `minQuantity` outputs upward, each output is sold at `unitPriceMicros`. */
export interface VolumeTier {
  minQuantity: number;
  unitPriceMicros: number;
}

export interface PricingRules {
  tiers: VolumeTier[];
  resolutionMultipliers: Record<string, number>;
  audioMultiplier: number;
  discountPercent: number;
}

export interface ModelPrice {
  id: string;
  modelId: string;
  unitPriceMicros: number;
  rules: PricingRules;
  active: boolean;
  updatedAt: string;
}

export interface ModelPriceRow {
  id: string;
  model_id: string;
  unit_price_micros: string | number;
  pricing_rules: unknown;
  active: boolean;
  updated_at: string;
}

/** Public selling rate for one active model; never carries upstream provider costs. */
export interface PricingRate {
  modelId: string;
  slug: string;
  name: string;
  summary: string;
  mode: GenerationMode;
  unit: PriceUnit;
  unitPriceMicros: number;
  rules: PricingRules;
  currency: Currency;
  updatedAt: string;
}

export interface QuoteRequest {
  kind: QuoteKind;
  modelId: string;
  settings: GenerationSettingsInput;
  templateId: string | null;
  quantity: number;
}

/** Stateless quote; generation persists it as the accepted snapshot and never reprices. */
export interface Quote {
  kind: QuoteKind;
  modelId: string;
  modelSlug: string;
  templateId: string | null;
  settings: GenerationSettingsInput;
  unit: PriceUnit;
  units: number;
  quantity: number;
  unitPriceMicros: number;
  subtotalMicros: number;
  discountMicros: number;
  totalMicros: number;
  currency: Currency;
  priceUpdatedAt: string;
  modelUpdatedAt: string;
  quotedAt: string;
}

export type ParseResult<T> = { ok: true; value: T } | { ok: false; message: string };

export interface ListRatesQuery {
  mode?: unknown;
}
