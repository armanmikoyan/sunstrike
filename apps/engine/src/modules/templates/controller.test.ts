import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMock = vi.hoisted(() => ({
  listTemplates: vi.fn(),
  getTemplate: vi.fn(),
}));

vi.mock("./service", () => serviceMock);

import { getTemplate, listTemplates } from "./controller";

const TEMPLATE_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function createResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  return { response: { status } as unknown as Response, status, json };
}

describe("templates controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists a page from the parsed query", async () => {
    const page = { templates: [], nextCursor: null };
    serviceMock.listTemplates.mockResolvedValue(page);
    const { response, status, json } = createResponse();

    await listTemplates({ query: { limit: "10" } } as unknown as Request, response);

    expect(serviceMock.listTemplates).toHaveBeenCalledWith({ limit: 10, cursor: null });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(page);
  });

  it("rejects a bad page query with 400 without calling the service", async () => {
    const { response } = createResponse();

    await expect(listTemplates({ query: { limit: "500" } } as unknown as Request, response)).rejects.toMatchObject({
      status: 400,
    });
    expect(serviceMock.listTemplates).not.toHaveBeenCalled();
  });

  it("replies with one template", async () => {
    serviceMock.getTemplate.mockResolvedValue({ id: TEMPLATE_ID });
    const { response, json } = createResponse();

    await getTemplate({ params: { id: TEMPLATE_ID } } as unknown as Request<{ id: string }>, response);

    expect(serviceMock.getTemplate).toHaveBeenCalledWith(TEMPLATE_ID);
    expect(json).toHaveBeenCalledWith({ template: { id: TEMPLATE_ID } });
  });
});
