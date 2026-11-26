import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LedgerEntry } from "./types";

const repositoryMock = vi.hoisted(() => ({
  lockUser: vi.fn(),
  getBalance: vi.fn(),
  findByKey: vi.fn(),
  insertEntry: vi.fn(),
}));

const tx = vi.hoisted(() => ({ query: vi.fn() }));

vi.mock("./repository", () => repositoryMock);
vi.mock("@/infra/database", () => ({ transaction: async (work: (scope: unknown) => unknown) => work(tx) }));

import * as service from "./service";

const USER = "11111111-1111-4111-8111-111111111111";
const GENERATION = "99999999-9999-4999-8999-999999999999";

const hold: LedgerEntry = {
  id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  userId: USER,
  generationId: GENERATION,
  type: "reserve",
  amountMicros: 510_000,
  idempotencyKey: `reserve:${GENERATION}`,
  createdAt: "2026-11-26T09:00:00.000Z",
};

describe("billing service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    repositoryMock.findByKey.mockResolvedValue(null);
    repositoryMock.getBalance.mockResolvedValue({ availableMicros: 1_000_000, reservedMicros: 0, currency: "USD" });
  });

  describe("reserve", () => {
    it("locks the user, checks the balance and holds the exact amount", async () => {
      await service.reserve({ userId: USER, generationId: GENERATION, amountMicros: 510_000 });

      expect(repositoryMock.lockUser).toHaveBeenCalledWith(tx, USER);
      expect(repositoryMock.getBalance).toHaveBeenCalledWith(USER, tx);
      expect(repositoryMock.insertEntry).toHaveBeenCalledWith(
        {
          userId: USER,
          generationId: GENERATION,
          type: "reserve",
          amountMicros: 510_000,
          idempotencyKey: hold.idempotencyKey,
        },
        tx,
      );
    });

    it("answers 402 and writes nothing when the balance is too low", async () => {
      repositoryMock.getBalance.mockResolvedValue({ availableMicros: 500_000, reservedMicros: 0, currency: "USD" });

      await expect(
        service.reserve({ userId: USER, generationId: GENERATION, amountMicros: 510_000 }),
      ).rejects.toMatchObject({ status: 402 });
      expect(repositoryMock.insertEntry).not.toHaveBeenCalled();
    });

    it("holds a generation only once", async () => {
      repositoryMock.findByKey.mockResolvedValue(hold);

      await service.reserve({ userId: USER, generationId: GENERATION, amountMicros: 510_000 });

      expect(repositoryMock.getBalance).not.toHaveBeenCalled();
      expect(repositoryMock.insertEntry).not.toHaveBeenCalled();
    });

    it("holds nothing for a free generation", async () => {
      await service.reserve({ userId: USER, generationId: GENERATION, amountMicros: 0 });

      expect(repositoryMock.lockUser).not.toHaveBeenCalled();
    });
  });

  describe("topUp", () => {
    it("credits a payment under its reference and returns the new balance", async () => {
      const balance = await service.topUp({ userId: USER, amountMicros: 5_000_000, reference: "order-1" });

      expect(repositoryMock.insertEntry).toHaveBeenCalledWith({
        userId: USER,
        generationId: null,
        type: "top_up",
        amountMicros: 5_000_000,
        idempotencyKey: "top-up:order-1",
      });
      expect(balance).toEqual({ availableMicros: 1_000_000, reservedMicros: 0, currency: "USD" });
    });
  });

  describe("capture and release", () => {
    it.each([
      ["capture" as const, service.capture],
      ["release" as const, service.release],
    ])("%s settles the held amount under one shared key", async (type, settle) => {
      repositoryMock.findByKey.mockResolvedValue(hold);

      await settle(GENERATION);

      expect(repositoryMock.findByKey).toHaveBeenCalledWith(`reserve:${GENERATION}`);
      expect(repositoryMock.insertEntry).toHaveBeenCalledWith({
        userId: USER,
        generationId: GENERATION,
        type,
        amountMicros: 510_000,
        idempotencyKey: `settle:${GENERATION}`,
      });
    });

    it("settles nothing when nothing was held", async () => {
      await service.capture(GENERATION);

      expect(repositoryMock.insertEntry).not.toHaveBeenCalled();
    });
  });
});
