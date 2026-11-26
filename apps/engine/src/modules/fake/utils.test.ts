import { describe, expect, it } from "vitest";
import { FAKE_ERRORS } from "./constants";
import { parseTopUpBody } from "./utils";

describe("parseTopUpBody", () => {
  it("reads a whole amount in micros", () => {
    expect(parseTopUpBody({ amountMicros: 5_000_000 })).toEqual({ ok: true, value: 5_000_000 });
  });

  it.each([
    undefined,
    {},
    { amountMicros: 0 },
    { amountMicros: 1.5 },
    { amountMicros: "5" },
    { amountMicros: 100_000_001 },
  ])("rejects %o", (body) => {
    expect(parseTopUpBody(body)).toEqual({ ok: false, message: FAKE_ERRORS.invalidAmount });
  });
});
