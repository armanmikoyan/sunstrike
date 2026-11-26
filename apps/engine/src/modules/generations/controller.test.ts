import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMock = vi.hoisted(() => ({
  createGeneration: vi.fn(),
  listGenerations: vi.fn(),
  getGeneration: vi.fn(),
}));

vi.mock("./service", () => serviceMock);

import { createGeneration, getGeneration, listGenerations } from "./controller";

const USER = "11111111-1111-4111-8111-111111111111";
const auth = { userId: USER };

const body = {
  kind: "create",
  prompt: "a lighthouse",
  modelId: "runware:kling",
  settings: { mode: "image", resolution: "1024", aspectRatio: "1:1" },
};

function createResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  return { response: { status } as unknown as Response, status, json };
}

describe("generation controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts a generation with 202", async () => {
    serviceMock.createGeneration.mockResolvedValue({ id: "g" });
    const { response, status, json } = createResponse();

    await createGeneration({ auth, headers: { "idempotency-key": "key-1" }, body } as unknown as Request, response);

    expect(serviceMock.createGeneration).toHaveBeenCalledWith(
      USER,
      "key-1",
      expect.objectContaining({ kind: "create" }),
    );
    expect(status).toHaveBeenCalledWith(202);
    expect(json).toHaveBeenCalledWith({ generation: { id: "g" } });
  });

  it("requires an Idempotency-Key header", async () => {
    const { response } = createResponse();

    await expect(createGeneration({ auth, headers: {}, body } as unknown as Request, response)).rejects.toMatchObject({
      status: 400,
    });
    expect(serviceMock.createGeneration).not.toHaveBeenCalled();
  });

  it("rejects an invalid body with 400", async () => {
    const { response } = createResponse();

    await expect(
      createGeneration(
        { auth, headers: { "idempotency-key": "key-1" }, body: { ...body, kind: "x" } } as unknown as Request,
        response,
      ),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("requires a signed-in user", async () => {
    const { response } = createResponse();

    await expect(listGenerations({ query: {} } as unknown as Request, response)).rejects.toMatchObject({ status: 401 });
  });

  it("lists the user's page", async () => {
    serviceMock.listGenerations.mockResolvedValue({ generations: [], nextCursor: null });
    const { response, status } = createResponse();

    await listGenerations({ auth, query: { limit: "5" } } as unknown as Request, response);

    expect(serviceMock.listGenerations).toHaveBeenCalledWith(USER, { limit: 5, cursor: null });
    expect(status).toHaveBeenCalledWith(200);
  });

  it("replies with one generation", async () => {
    serviceMock.getGeneration.mockResolvedValue({ id: "g" });
    const { response, json } = createResponse();

    await getGeneration({ auth, params: { id: "g" } } as unknown as Request<{ id: string }>, response);

    expect(serviceMock.getGeneration).toHaveBeenCalledWith(USER, "g");
    expect(json).toHaveBeenCalledWith({ generation: { id: "g" } });
  });
});
