import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMock = vi.hoisted(() => ({
  requestUpload: vi.fn(),
  completeUpload: vi.fn(),
  getAsset: vi.fn(),
}));

vi.mock("./service", () => serviceMock);

import { completeUpload, getAsset, requestUpload } from "./controller";

const auth = { userId: "11111111-1111-4111-8111-111111111111", authSubject: "subject" };
const ASSET_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

function createResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  return { response: { status } as unknown as Response, status, json };
}

describe("media controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes a parsed upload request for the signed-in user and replies 201", async () => {
    const ticket = { asset: { id: ASSET_ID }, upload: { url: "https://storage.test/upload" } };
    serviceMock.requestUpload.mockResolvedValue(ticket);
    const { response, status, json } = createResponse();
    const body = { contentType: "image/png", sizeBytes: 2048 };

    await requestUpload({ auth, body } as unknown as Request, response);

    expect(serviceMock.requestUpload).toHaveBeenCalledWith(auth.userId, body);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(ticket);
  });

  it("rejects a malformed upload body with 400 without calling the service", async () => {
    const { response } = createResponse();

    await expect(
      requestUpload({ auth, body: { contentType: "image/png" } } as unknown as Request, response),
    ).rejects.toMatchObject({ status: 400 });
    expect(serviceMock.requestUpload).not.toHaveBeenCalled();
  });

  it("replies 401 without a signed-in user", async () => {
    const { response } = createResponse();

    await expect(
      getAsset({ params: { id: ASSET_ID } } as unknown as Request<{ id: string }>, response),
    ).rejects.toMatchObject({ status: 401 });
    expect(serviceMock.getAsset).not.toHaveBeenCalled();
  });

  it("completes and reads an asset by id for the signed-in user", async () => {
    serviceMock.completeUpload.mockResolvedValue({ id: ASSET_ID, status: "ready" });
    serviceMock.getAsset.mockResolvedValue({ id: ASSET_ID, status: "ready" });
    const completed = createResponse();
    const read = createResponse();
    const request = { auth, params: { id: ASSET_ID } } as unknown as Request<{ id: string }>;

    await completeUpload(request, completed.response);
    await getAsset(request, read.response);

    expect(serviceMock.completeUpload).toHaveBeenCalledWith(auth.userId, ASSET_ID);
    expect(serviceMock.getAsset).toHaveBeenCalledWith(auth.userId, ASSET_ID);
    expect(completed.json).toHaveBeenCalledWith({ asset: { id: ASSET_ID, status: "ready" } });
    expect(read.status).toHaveBeenCalledWith(200);
  });
});
