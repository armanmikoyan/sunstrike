import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMock = vi.hoisted(() => ({ listOfferings: vi.fn() }));

vi.mock("./service", () => serviceMock);

import { listOfferings } from "./controller";

function createResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  return { response: { status } as unknown as Response, status, json };
}

describe("offerings controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns offerings and forwards the optional mode filter", async () => {
    serviceMock.listOfferings.mockResolvedValue([]);
    const { response, status, json } = createResponse();

    await listOfferings({ query: { mode: "video" } } as unknown as Request, response);

    expect(serviceMock.listOfferings).toHaveBeenCalledWith("video");
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ offerings: [] });
  });

  it("rejects a non-string mode query parameter with 400", async () => {
    const { response } = createResponse();

    await expect(listOfferings({ query: { mode: ["video"] } } as unknown as Request, response)).rejects.toMatchObject({
      status: 400,
    });
  });
});
