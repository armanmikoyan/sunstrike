import { transaction } from "@/infra/database";
import { paymentRequired } from "@/shared/utils";
import { BILLING_ERRORS } from "./constants";
import * as repository from "./repository";
import type { Balance, ReserveRequest, Settlement, TopUpCredit } from "./types";
import { reserveKey, settleKey, topUpKey } from "./utils";

export async function getBalance(userId: string): Promise<Balance> {
  return repository.getBalance(userId);
}

/** Credit a confirmed payment; the same reference never credits twice. */
export async function topUp(credit: TopUpCredit): Promise<Balance> {
  await repository.insertEntry({
    userId: credit.userId,
    generationId: null,
    type: "top_up",
    amountMicros: credit.amountMicros,
    idempotencyKey: topUpKey(credit.reference),
  });

  return repository.getBalance(credit.userId);
}

/**
 * Hold a generation's exact price before it runs. The user's ledger is locked
 * while the balance is checked, so concurrent holds cannot overspend; holding
 * the same generation again is a no-op. A free generation holds nothing.
 */
export async function reserve(request: ReserveRequest): Promise<void> {
  if (request.amountMicros <= 0) return;

  await transaction(async (tx) => {
    await repository.lockUser(tx, request.userId);

    const key = reserveKey(request.generationId);

    if (await repository.findByKey(key, tx)) return;

    const balance = await repository.getBalance(request.userId, tx);

    if (balance.availableMicros < request.amountMicros) throw paymentRequired(BILLING_ERRORS.insufficientFunds);

    await repository.insertEntry(
      {
        userId: request.userId,
        generationId: request.generationId,
        type: "reserve",
        amountMicros: request.amountMicros,
        idempotencyKey: key,
      },
      tx,
    );
  });
}

/** End a generation's hold once, for its exact amount; a second settlement of either kind is a no-op. */
async function settle(generationId: string, type: Settlement): Promise<void> {
  const hold = await repository.findByKey(reserveKey(generationId));

  if (!hold) return;

  await repository.insertEntry({
    userId: hold.userId,
    generationId,
    type,
    amountMicros: hold.amountMicros,
    idempotencyKey: settleKey(generationId),
  });
}

/** Spend a succeeded generation's hold. */
export async function capture(generationId: string): Promise<void> {
  await settle(generationId, "capture");
}

/** Return a failed generation's hold to the available balance. */
export async function release(generationId: string): Promise<void> {
  await settle(generationId, "release");
}
