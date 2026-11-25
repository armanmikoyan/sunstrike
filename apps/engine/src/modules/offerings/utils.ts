import type { CatalogModel } from "@/modules/catalog";
import type { PricingRate } from "@/modules/pricing";
import type { Offering } from "./types";

/** Pair each catalog model with its rate, in catalog order; a model without an active price is not offered. */
export function buildOfferings(models: readonly CatalogModel[], rates: readonly PricingRate[]): Offering[] {
  const byModel = new Map(rates.map((rate) => [rate.modelId, rate]));

  return models.flatMap((model) => {
    const rate = byModel.get(model.id);

    if (!rate) return [];

    const { modelId: _modelId, ...price } = rate;

    return [
      {
        model: {
          id: model.id,
          slug: model.slug,
          name: model.name,
          summary: model.summary,
          vendor: model.vendor,
          capabilities: model.capabilities,
        },
        price,
      },
    ];
  });
}
