export const FAKE_TOP_UP = {
  maxMicros: 100_000_000,
  referencePrefix: "fake",
} as const;

export const FAKE_ERRORS = {
  invalidAmount: `Send { amountMicros } as a whole number from 1 to ${FAKE_TOP_UP.maxMicros}.`,
} as const;
