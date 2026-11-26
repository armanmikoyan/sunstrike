export const TRANSACTION_TYPES = ["top_up", "reserve", "capture", "release", "refund"] as const;

export const CURRENCY = "USD";

export const BILLING_ERRORS = {
  insufficientFunds: "Your balance is too low for this generation. Top up and try again.",
} as const;
