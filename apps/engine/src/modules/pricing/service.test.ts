import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CatalogModel } from "@/modules/catalog";
import type { ModelPrice, QuoteRequest } from "./types";

const repositoryMock = vi.hoisted(() => ({
  listActiveByModelIds: vi.fn(),
  findActiveByModelId: vi.fn(),
}));

const catalogMock = vi.hoisted(() => ({
  listActiveModels: vi.fn(),
  validateGenerationSettings: vi.fn(),
}));

vi.mock("./repository", () => repositoryMock);
vi.mock("@/modules/catalog", () => ({ catalog: catalogMock }));

import * as service from "./service";

const model: CatalogModel = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "chronolab-motion-2",
  name: "Chronolab Motion 2",
  summary: "Native audio and longer takes.",
  provider: "chronolab",
  providerModelKey: "motion-2",
  capabilities: {
    modes: ["video"],
    inputs: ["image", "video"],
    resolutions: ["1080p"],
    durationsSeconds: [6],
    aspectRatios: ["16:9"],
    audio: true,
  },
  active: true,
  updatedAt: "2026-11-24T12:00:00.000Z",
};

const price: ModelPrice = {
  id: "33333333-3333-4333-8333-333333333333",
  modelId: model.id,
  unitPriceMicros: 85_000,
  rules: { tiers: [], resolutionMultipliers: {}, audioMultiplier: 1, discountPercent: 0 },
  active: true,
  updatedAt: "2026-11-25T09:00:00.000Z",
};

const request: QuoteRequest = {
  kind: "create",
  modelId: model.slug,
  settings: { mode: "video", resolution: "1080p", aspectRatio: "16:9", durationSeconds: 6 },
  templateId: null,
  quantity: 1,
};

describe("pricing service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists rates for active catalog models that have a price", async () => {
    catalogMock.listActiveModels.mockResolvedValue([model]);
    repositoryMock.listActiveByModelIds.mockResolvedValue([price]);

    const rates = await service.listRates("video");

    expect(catalogMock.listActiveModels).toHaveBeenCalledWith("video");
    expect(repositoryMock.listActiveByModelIds).toHaveBeenCalledWith([model.id]);
    expect(rates).toHaveLength(1);
    expect(rates[0]).toMatchObject({ slug: model.slug, unitPriceMicros: 85_000 });
    expect(rates[0]).not.toHaveProperty("providerCostMicros");
  });

  it("quotes validated settings against the model's active price", async () => {
    catalogMock.validateGenerationSettings.mockResolvedValue({ ...model, providerCostMicros: 55_000 });
    repositoryMock.findActiveByModelId.mockResolvedValue(price);

    const quote = await service.createQuote(request);

    expect(catalogMock.validateGenerationSettings).toHaveBeenCalledWith(model.slug, request.settings);
    expect(repositoryMock.findActiveByModelId).toHaveBeenCalledWith(model.id);
    expect(quote).toMatchObject({ modelId: model.id, totalMicros: 510_000, currency: "USD" });
    expect(quote).not.toHaveProperty("providerCostMicros");
  });

  it("rejects an out-of-range quantity before reading the catalog", async () => {
    await expect(service.createQuote({ ...request, quantity: 0 })).rejects.toMatchObject({ status: 400 });
    await expect(service.createQuote({ ...request, quantity: 501 })).rejects.toMatchObject({ status: 400 });
    expect(catalogMock.validateGenerationSettings).not.toHaveBeenCalled();
  });

  it("throws 404 when the model has no active price", async () => {
    catalogMock.validateGenerationSettings.mockResolvedValue(model);
    repositoryMock.findActiveByModelId.mockResolvedValue(null);

    await expect(service.createQuote(request)).rejects.toMatchObject({ status: 404 });
  });
});
