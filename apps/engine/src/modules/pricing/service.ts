import { catalog } from "@/modules/catalog";
import { badRequest, notFound } from "@/shared/utils";
import { MAX_QUOTE_QUANTITY } from "./constants";
import * as repository from "./repository";
import type { PricingRate, Quote, QuoteRequest } from "./types";
import { buildQuote, buildRates } from "./utils";

export async function listRates(mode?: string): Promise<PricingRate[]> {
  const models = await catalog.listActiveModels(mode);
  const prices = await repository.listActiveByModelIds(models.map((model) => model.id));

  return buildRates(models, prices);
}

export async function createQuote(request: QuoteRequest): Promise<Quote> {
  if (request.quantity < 1 || request.quantity > MAX_QUOTE_QUANTITY) {
    throw badRequest(`Quantity must be between 1 and ${MAX_QUOTE_QUANTITY}.`);
  }

  const model = await catalog.validateGenerationSettings(request.modelId, request.settings);
  const price = await repository.findActiveByModelId(model.id);

  if (!price) {
    throw notFound("This model has no active price.");
  }

  return buildQuote(request, model, price, new Date());
}
