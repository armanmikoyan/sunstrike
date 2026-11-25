import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMock = vi.hoisted(() => ({
  calculateQuote: vi.fn(),
}));

vi.mock("./service", () => serviceMock);

import { calculateQuote } from "./controller";

function createResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  return { response: { status } as unknown as Response, status, json };
}

describe("pricing controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes a parsed quote query to the service", async () => {
    const quote = { totalMicros: 510_000 };
    serviceMock.calculateQuote.mockResolvedValue(quote);
    const { response, status, json } = createResponse();
    const query = {
      kind: "create",
      modelId: "chronolab-motion-2",
      mode: "video",
      resolution: "1080p",
      aspectRatio: "16:9",
      durationSeconds: "6",
    };

    await calculateQuote({ query } as unknown as Request, response);

    expect(serviceMock.calculateQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: 1,
        templateId: null,
        settings: expect.objectContaining({ durationSeconds: 6 }),
      }),
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ quote });
  });

  it("rejects a malformed quote query with 400 without calling the service", async () => {
    const { response } = createResponse();

    await expect(calculateQuote({ query: { kind: "create" } } as unknown as Request, response)).rejects.toMatchObject({
      status: 400,
    });
    expect(serviceMock.calculateQuote).not.toHaveBeenCalled();
  });
});
