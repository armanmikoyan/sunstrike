import * as service from "./service";

/** Balances from an append-only ledger, top-up credits, and the hold, capture and release around each generation. */
export const billing = {
  getBalance: service.getBalance,
  topUp: service.topUp,
  reserve: service.reserve,
  capture: service.capture,
  release: service.release,
};

export type { Balance, ReserveRequest, TopUpCredit } from "./types";
