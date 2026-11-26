import { describe, expect, it } from "vitest";
import { mapBalanceRow, mapTransactionRow, reserveKey, settleKey, topUpKey } from "./utils";

const GENERATION = "99999999-9999-4999-8999-999999999999";

describe("billing utils", () => {
  it("keys a generation's hold and its single settlement", () => {
    expect(reserveKey(GENERATION)).toBe(`reserve:${GENERATION}`);
    expect(settleKey(GENERATION)).toBe(`settle:${GENERATION}`);
  });

  it("keys a top-up by its payment reference", () => {
    expect(topUpKey("order-1")).toBe("top-up:order-1");
  });

  it("reads bigint sums and defaults an empty ledger to zero", () => {
    expect(mapBalanceRow({ available_micros: "4280000", reserved_micros: "510000" })).toEqual({
      availableMicros: 4_280_000,
      reservedMicros: 510_000,
      currency: "USD",
    });
    expect(mapBalanceRow(undefined)).toEqual({ availableMicros: 0, reservedMicros: 0, currency: "USD" });
  });

  it("maps a ledger row", () => {
    expect(
      mapTransactionRow({
        id: "e",
        user_id: "u",
        generation_id: null,
        type: "top_up",
        amount_micros: "10000000",
        idempotency_key: "top_up:order-1",
        created_at: new Date("2026-11-26T09:00:00Z"),
      }),
    ).toEqual({
      id: "e",
      userId: "u",
      generationId: null,
      type: "top_up",
      amountMicros: 10_000_000,
      idempotencyKey: "top_up:order-1",
      createdAt: "2026-11-26T09:00:00.000Z",
    });
  });
});
