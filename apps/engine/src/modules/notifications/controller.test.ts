import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMock = vi.hoisted(() => ({ listNotifications: vi.fn(), markRead: vi.fn() }));

vi.mock("./service", () => serviceMock);

import { listNotifications, updateNotification } from "./controller";

const USER = "11111111-1111-4111-8111-111111111111";
const auth = { userId: USER };

function createResponse() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));

  return { response: { status } as unknown as Response, status, json };
}

describe("notifications controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires a signed-in user", async () => {
    const { response } = createResponse();

    await expect(listNotifications({ query: {} } as unknown as Request, response)).rejects.toMatchObject({
      status: 401,
    });
  });

  it("lists the user's page", async () => {
    serviceMock.listNotifications.mockResolvedValue({ notifications: [], nextCursor: null });
    const { response, status } = createResponse();

    await listNotifications({ auth, query: {} } as unknown as Request, response);

    expect(serviceMock.listNotifications).toHaveBeenCalledWith(USER, { limit: 20, cursor: null });
    expect(status).toHaveBeenCalledWith(200);
  });

  it("marks a notification read", async () => {
    serviceMock.markRead.mockResolvedValue({ id: "n" });
    const { response, json } = createResponse();

    await updateNotification(
      { auth, params: { id: "n" }, body: { read: true } } as unknown as Request<{ id: string }>,
      response,
    );

    expect(serviceMock.markRead).toHaveBeenCalledWith(USER, "n");
    expect(json).toHaveBeenCalledWith({ notification: { id: "n" } });
  });

  it("rejects any other change with 400", async () => {
    const { response } = createResponse();

    await expect(
      updateNotification(
        { auth, params: { id: "n" }, body: { read: false } } as unknown as Request<{ id: string }>,
        response,
      ),
    ).rejects.toMatchObject({ status: 400 });
    expect(serviceMock.markRead).not.toHaveBeenCalled();
  });
});
