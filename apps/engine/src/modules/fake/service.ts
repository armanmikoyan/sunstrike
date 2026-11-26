import { randomUUID } from "node:crypto";
import { type Balance, billing } from "@/modules/billing";
import { generations } from "@/modules/generations";
import { FAKE_TOP_UP } from "./constants";
import { fakeProvider } from "./providers";

/** Credit the balance as if a payment had been confirmed; no payment provider is involved. */
export async function topUp(userId: string, amountMicros: number): Promise<Balance> {
  return billing.topUp({ userId, amountMicros, reference: `${FAKE_TOP_UP.referencePrefix}:${randomUUID()}` });
}

/** Run the next due job now with the fake provider, without waiting for the worker. */
export async function runNextJob(): Promise<boolean> {
  return generations.processNextJob(fakeProvider);
}
