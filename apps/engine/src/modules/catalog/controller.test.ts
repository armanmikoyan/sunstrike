import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CatalogModel } from "./types";

const serviceMock = vi.hoisted(() => ({
  listActiveModels: vi.fn(),
  getModel: vi.fn(),
}));

vi.mock("./service", () => serviceMock);

import { getModel, listModels } from "./controller";

function createResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  return { response: { status } as unknown as Response, status, json };
}

const sampleModel: CatalogModel = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "chronolab-motion-2",
  name: "Chronolab Motion 2",
  summary: "Native audio and longer takes.",
  provider: "chronolab",
  providerModelKey: "motion-2",
  vendor: null,
  capabilities: {
    modes: ["video"],
    inputs: ["image", "video"],
    resolutions: ["720p", "1080p"],
    durationsSeconds: [4, 5, 6, 8, 12],
    aspectRatios: ["16:9", "9:16", "1:1"],
    audio: true,
  },
  active: true,
  updatedAt: "2026-11-24T12:00:00.000Z",
};

describe("catalog controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns active models and forwards optional mode filter", async () => {
    serviceMock.listActiveModels.mockResolvedValue([sampleModel]);
    const { response, status, json } = createResponse();

    await listModels({ query: { mode: "video" } } as unknown as Request, response);

    expect(serviceMock.listActiveModels).toHaveBeenCalledWith("video");
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ models: [sampleModel] });
  });

  it("rejects a non-string mode query parameter with 400", async () => {
    const { response } = createResponse();

    await expect(listModels({ query: { mode: ["video"] } } as unknown as Request, response)).rejects.toMatchObject({
      status: 400,
    });
  });

  it("returns a single active model by id or slug", async () => {
    serviceMock.getModel.mockResolvedValue(sampleModel);
    const { response, status, json } = createResponse();

    await getModel({ params: { id: "chronolab-motion-2" } } as unknown as Request, response);

    expect(serviceMock.getModel).toHaveBeenCalledWith("chronolab-motion-2");
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ model: sampleModel });
  });
});
