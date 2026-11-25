import type { CatalogModel, GenerationMode, GenerationSettingsInput } from "@/modules/catalog";
import { isOneOf, isPositiveNumber, isRecord, isUuid, isWholeNumber } from "@/shared/utils";
import { CURRENCY, PRICE_UNITS, QUOTE_KINDS } from "./constants";
import type {
  ModelPrice,
  ModelPriceRow,
  ParseResult,
  PricingRate,
  PricingRules,
  Quote,
  QuoteRequest,
  VolumeTier,
} from "./types";

export function isPricedMode(value: unknown): value is GenerationMode {
  return typeof value === "string" && Object.hasOwn(PRICE_UNITS, value);
}

function parseTier(value: unknown): VolumeTier[] {
  if (!isRecord(value)) return [];

  const { min_quantity: minQuantity, unit_price_micros: unitPriceMicros } = value;

  return isWholeNumber(minQuantity) && minQuantity > 0 && isWholeNumber(unitPriceMicros)
    ? [{ minQuantity, unitPriceMicros }]
    : [];
}

/** Normalise the stored `pricing_rules` jsonb, dropping anything malformed. */
export function parsePricingRules(value: unknown): PricingRules {
  const rules: Record<string, unknown> = isRecord(value) ? value : {};
  const multipliers = isRecord(rules.resolution_multipliers) ? rules.resolution_multipliers : {};
  const discount = rules.discount_percent;

  return {
    tiers: (Array.isArray(rules.tiers) ? rules.tiers.flatMap(parseTier) : []).toSorted(
      (a, b) => a.minQuantity - b.minQuantity,
    ),
    resolutionMultipliers: Object.fromEntries(
      Object.entries(multipliers).flatMap(([resolution, multiplier]) =>
        isPositiveNumber(multiplier) ? [[resolution, multiplier] as const] : [],
      ),
    ),
    audioMultiplier: isPositiveNumber(rules.audio_multiplier) ? rules.audio_multiplier : 1,
    discountPercent: typeof discount === "number" && discount >= 0 && discount <= 100 ? discount : 0,
  };
}

export function mapPriceRow(row: ModelPriceRow): ModelPrice {
  const unitPriceMicros =
    typeof row.unit_price_micros === "number" ? row.unit_price_micros : Number.parseInt(row.unit_price_micros, 10);

  return {
    id: row.id,
    modelId: row.model_id,
    unitPriceMicros: Number.isFinite(unitPriceMicros) ? unitPriceMicros : 0,
    rules: parsePricingRules(row.pricing_rules),
    active: row.active,
    updatedAt: row.updated_at,
  };
}

/** The unit price after volume tiers: the highest tier the quantity reaches, else the base price. */
export function tierUnitPrice(price: ModelPrice, quantity: number): number {
  let unitPriceMicros = price.unitPriceMicros;

  for (const tier of price.rules.tiers) {
    if (quantity >= tier.minQuantity) unitPriceMicros = tier.unitPriceMicros;
  }

  return unitPriceMicros;
}

export function settingsMultiplier(rules: PricingRules, settings: GenerationSettingsInput): number {
  const resolution = rules.resolutionMultipliers[settings.resolution] ?? 1;
  const audio = settings.audio ? rules.audioMultiplier : 1;

  return resolution * audio;
}

export function buildRates(models: readonly CatalogModel[], prices: readonly ModelPrice[]): PricingRate[] {
  const byModel = new Map(prices.map((price) => [price.modelId, price]));

  return models.flatMap((model) => {
    const price = byModel.get(model.id);
    const mode = model.capabilities.modes[0];

    if (!price || !mode) return [];

    return [
      {
        modelId: model.id,
        slug: model.slug,
        name: model.name,
        summary: model.summary,
        mode,
        unit: PRICE_UNITS[mode],
        unitPriceMicros: price.unitPriceMicros,
        rules: price.rules,
        currency: CURRENCY,
        updatedAt: price.updatedAt,
      },
    ];
  });
}

export function buildQuote(request: QuoteRequest, model: CatalogModel, price: ModelPrice, quotedAt: Date): Quote {
  const { settings, quantity } = request;
  const unit = PRICE_UNITS[settings.mode];
  const units = unit === PRICE_UNITS.video ? (settings.durationSeconds ?? 0) : 1;
  const unitPriceMicros = tierUnitPrice(price, quantity);
  const subtotalMicros = Math.round(unitPriceMicros * settingsMultiplier(price.rules, settings) * units * quantity);
  const discountMicros = Math.round((subtotalMicros * price.rules.discountPercent) / 100);

  return {
    kind: request.kind,
    modelId: model.id,
    modelSlug: model.slug,
    templateId: request.templateId,
    settings,
    unit,
    units,
    quantity,
    unitPriceMicros,
    subtotalMicros,
    discountMicros,
    totalMicros: subtotalMicros - discountMicros,
    currency: CURRENCY,
    priceUpdatedAt: price.updatedAt,
    modelUpdatedAt: model.updatedAt,
    quotedAt: quotedAt.toISOString(),
  };
}

function parseSettings(value: unknown): ParseResult<GenerationSettingsInput> {
  if (!isRecord(value)) return { ok: false, message: "Settings are required." };

  const { mode, resolution, aspectRatio, durationSeconds, audio } = value;

  if (!isPricedMode(mode)) {
    return { ok: false, message: `Settings mode must be one of: ${Object.keys(PRICE_UNITS).join(", ")}.` };
  }

  if (typeof resolution !== "string" || !resolution) {
    return { ok: false, message: "Settings resolution is required." };
  }

  if (typeof aspectRatio !== "string" || !aspectRatio) {
    return { ok: false, message: "Settings aspect ratio is required." };
  }

  if (durationSeconds !== undefined && durationSeconds !== null && typeof durationSeconds !== "number") {
    return { ok: false, message: "Settings duration must be a number of seconds." };
  }

  if (audio !== undefined && typeof audio !== "boolean") {
    return { ok: false, message: "Settings audio must be true or false." };
  }

  return { ok: true, value: { mode, resolution, aspectRatio, durationSeconds, audio } };
}

/** Read the quote body into a typed request; model support and limits are the service's to judge. */
export function parseQuoteRequest(body: unknown): ParseResult<QuoteRequest> {
  const input: Record<string, unknown> = isRecord(body) ? body : {};
  const { kind, modelId, settings, templateId, quantity } = input;

  if (!isOneOf(QUOTE_KINDS, kind)) {
    return { ok: false, message: `Kind must be one of: ${QUOTE_KINDS.join(", ")}.` };
  }

  if (typeof modelId !== "string" || !modelId.trim()) {
    return { ok: false, message: "A model id is required." };
  }

  if (templateId !== undefined && templateId !== null && (typeof templateId !== "string" || !isUuid(templateId))) {
    return { ok: false, message: "Template id must be a UUID." };
  }

  if (quantity !== undefined && !Number.isInteger(quantity)) {
    return { ok: false, message: "Quantity must be a whole number." };
  }

  const parsedSettings = parseSettings(settings);

  if (!parsedSettings.ok) return parsedSettings;

  return {
    ok: true,
    value: {
      kind,
      modelId: modelId.trim(),
      settings: parsedSettings.value,
      templateId: templateId ?? null,
      quantity: typeof quantity === "number" ? quantity : 1,
    },
  };
}
