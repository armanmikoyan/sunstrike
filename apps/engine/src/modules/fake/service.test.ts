import { beforeEach, describe, expect, it, vi } from "vitest";

const billingMock = vi.hoisted(() => ({ topUp: vi.fn() }));
const generationsMock = vi.hoisted(() => ({ processNextJob: vi.fn() }));

vi.mock("@/modules/billing", () => ({ billing: billingMock }));
vi.mock("@/modules/generations", () => ({ generations: generationsMock }));

import { fakeProvider } from "./providers";
import * as service from "./service";

const USER = "11111111-1111-4111-8111-111111111111";

describe("fake service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("credits a top-up under a fresh fake reference", async () => {
    billingMock.topUp.mockResolvedValue({ availableMicros: 5_000_000, reservedMicros: 0, currency: "USD" });

    const balance = await service.topUp(USER, 5_000_000);
    await service.topUp(USER, 5_000_000);

    const [first, second] = billingMock.topUp.mock.calls.map(([credit]) => credit);
    expect(first).toMatchObject({ userId: USER, amountMicros: 5_000_000, reference: expect.stringMatching(/^fake:/) });
    expect(first.reference).not.toBe(second.reference);
    expect(balance.availableMicros).toBe(5_000_000);
  });

  it("runs the next job with the fake provider", async () => {
    generationsMock.processNextJob.mockResolvedValue(true);

    await expect(service.runNextJob()).resolves.toBe(true);
    expect(generationsMock.processNextJob).toHaveBeenCalledWith(fakeProvider);
  });
});
