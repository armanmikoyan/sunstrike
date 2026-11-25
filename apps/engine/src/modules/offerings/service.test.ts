import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CatalogModel } from "@/modules/catalog";
import type { PricingRate } from "@/modules/pricing";

const catalogMock = vi.hoisted(() => ({ listActiveModels: vi.fn() }));
const pricingMock = vi.hoisted(() => ({ listRates: vi.fn() }));

vi.mock("@/modules/catalog", () => ({ catalog: catalogMock }));
vi.mock("@/modules/pricing", () => ({ pricing: pricingMock }));

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
    inputs: ["image"],
    resolutions: ["1080p"],
    durationsSeconds: [6],
    aspectRatios: ["16:9"],
    audio: true,
  },
  active: true,
  updatedAt: "2026-11-24T12:00:00.000Z",
};

const rate: PricingRate = {
  modelId: model.id,
  unit: "per_second",
  unitPriceMicros: 85_000,
  rules: { tiers: [], resolutionMultipliers: {}, audioMultiplier: 1, discountPercent: 0 },
  currency: "USD",
  updatedAt: "2026-11-25T09:00:00.000Z",
};

describe("offerings service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prices the active catalog models for the mode in one pass", async () => {
    catalogMock.listActiveModels.mockResolvedValue([model]);
    pricingMock.listRates.mockResolvedValue([rate]);

    const offerings = await service.listOfferings("video");

    expect(catalogMock.listActiveModels).toHaveBeenCalledWith("video");
    expect(pricingMock.listRates).toHaveBeenCalledWith([model]);
    expect(offerings).toHaveLength(1);
    expect(offerings[0]).toMatchObject({ model: { slug: model.slug }, price: { unitPriceMicros: 85_000 } });
  });

  it("passes catalog errors such as an invalid mode through", async () => {
    catalogMock.listActiveModels.mockRejectedValue(Object.assign(new Error("Invalid mode."), { status: 400 }));

    await expect(service.listOfferings("3d")).rejects.toMatchObject({ status: 400 });
    expect(pricingMock.listRates).not.toHaveBeenCalled();
  });
});
