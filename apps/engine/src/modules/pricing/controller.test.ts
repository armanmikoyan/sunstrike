import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMock = vi.hoisted(() => ({
  listRates: vi.fn(),
  createQuote: vi.fn(),
}));

vi.mock("./service", () => serviceMock);

import { createQuote, listRates } from "./controller";

function createResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  return { response: { status } as unknown as Response, status, json };
}

describe("pricing controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns rates and forwards the optional mode filter", async () => {
    serviceMock.listRates.mockResolvedValue([]);
    const { response, status, json } = createResponse();

    await listRates({ query: { mode: "image" } } as unknown as Request, response);

    expect(serviceMock.listRates).toHaveBeenCalledWith("image");
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ rates: [] });
  });

  it("rejects a non-string mode query parameter with 400", async () => {
    const { response } = createResponse();

    await expect(listRates({ query: { mode: ["image"] } } as unknown as Request, response)).rejects.toMatchObject({
      status: 400,
    });
  });

  it("passes a parsed quote body to the service", async () => {
    const quote = { totalMicros: 510_000 };
    serviceMock.createQuote.mockResolvedValue(quote);
    const { response, status, json } = createResponse();
    const body = {
      kind: "create",
      modelId: "chronolab-motion-2",
      settings: { mode: "video", resolution: "1080p", aspectRatio: "16:9", durationSeconds: 6 },
    };

    await createQuote({ body } as unknown as Request, response);

    expect(serviceMock.createQuote).toHaveBeenCalledWith(expect.objectContaining({ quantity: 1, templateId: null }));
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ quote });
  });

  it("rejects a malformed quote body with 400 without calling the service", async () => {
    const { response } = createResponse();

    await expect(createQuote({ body: { kind: "create" } } as unknown as Request, response)).rejects.toMatchObject({
      status: 400,
    });
    expect(serviceMock.createQuote).not.toHaveBeenCalled();
  });
});
