import { beforeEach, describe, expect, it, vi } from "vitest";

const infraMock = vi.hoisted(() => ({
  checkInfraHealth: vi.fn(),
}));

vi.mock("@/infra", () => infraMock);

import { getHealth } from "./service";

describe("health service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 when database is connected", async () => {
    infraMock.checkInfraHealth.mockResolvedValue({
      ok: true,
      database: "connected",
    });

    await expect(getHealth()).resolves.toEqual({
      statusCode: 200,
      body: { status: "ok", database: "connected" },
    });
  });

  it("returns 503 when database is unavailable", async () => {
    infraMock.checkInfraHealth.mockResolvedValue({
      ok: false,
      database: "unavailable",
    });

    await expect(getHealth()).resolves.toEqual({
      statusCode: 503,
      body: { status: "error", database: "unavailable" },
    });
  });
});
