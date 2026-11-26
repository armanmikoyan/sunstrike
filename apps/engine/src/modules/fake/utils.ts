import type { ParseResult } from "@/shared/types";
import { isRecord, parseFailure } from "@/shared/utils";
import { FAKE_ERRORS, FAKE_TOP_UP } from "./constants";

/** The amount from `{ amountMicros }`, capped so a typo cannot mint a fortune. */
export function parseTopUpBody(body: unknown): ParseResult<number> {
  const amount = isRecord(body) ? body.amountMicros : undefined;

  return Number.isInteger(amount) && Number(amount) > 0 && Number(amount) <= FAKE_TOP_UP.maxMicros
    ? { ok: true, value: Number(amount) }
    : parseFailure(FAKE_ERRORS.invalidAmount);
}
