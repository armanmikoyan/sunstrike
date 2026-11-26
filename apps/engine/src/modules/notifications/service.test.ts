import { beforeEach, describe, expect, it, vi } from "vitest";

const repositoryMock = vi.hoisted(() => ({ insert: vi.fn(), listForUser: vi.fn(), markRead: vi.fn() }));
const generationsMock = vi.hoisted(() => ({ onFinished: vi.fn() }));

vi.mock("./repository", () => repositoryMock);
vi.mock("@/modules/generations", () => ({ generations: generationsMock }));

import * as service from "./service";

const USER = "11111111-1111-4111-8111-111111111111";
const GENERATION = "99999999-9999-4999-8999-999999999999";
const NOTIFICATION = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

const notification = {
  id: NOTIFICATION,
  userId: USER,
  generationId: GENERATION,
  type: "generation_succeeded",
  readAt: null,
  createdAt: "2026-11-26T09:00:00.000Z",
};

describe("notifications service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records a notice for each finished generation", async () => {
    await service.record({ generationId: GENERATION, userId: USER, status: "failed", failureCode: "provider_error" });

    expect(repositoryMock.insert).toHaveBeenCalledWith({
      userId: USER,
      generationId: GENERATION,
      type: "generation_failed",
    });
  });

  it("listens to finished generations", () => {
    const stop = vi.fn();
    generationsMock.onFinished.mockReturnValue(stop);

    expect(service.listen()).toBe(stop);
    expect(generationsMock.onFinished).toHaveBeenCalledWith(service.record);
  });

  it("pages the user's notifications", async () => {
    repositoryMock.listForUser.mockResolvedValue([notification, { ...notification, id: "next" }]);

    const page = await service.listNotifications(USER, { limit: 1, cursor: null });

    expect(repositoryMock.listForUser).toHaveBeenCalledWith(USER, 2, null);
    expect(page).toEqual({
      notifications: [
        {
          id: NOTIFICATION,
          generationId: GENERATION,
          type: "generation_succeeded",
          readAt: null,
          createdAt: notification.createdAt,
        },
      ],
      nextCursor: NOTIFICATION,
    });
  });

  it("reports another user's notification as not found", async () => {
    repositoryMock.markRead.mockResolvedValue(null);

    await expect(service.markRead(USER, NOTIFICATION)).rejects.toMatchObject({ status: 404 });
  });
});
