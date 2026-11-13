export const MIN_IMAGES = 1;
export const MAX_IMAGES = 500;

export function getImageUnitPrice(quantity: number) {
  if (quantity >= 50) return 0.05;
  if (quantity >= 10) return 0.06;
  return 0.07;
}

export function clampImageQuantity(quantity: number) {
  return Math.min(MAX_IMAGES, Math.max(MIN_IMAGES, Math.round(quantity)));
}

export function getImageQuote(quantity: number) {
  const count = clampImageQuantity(quantity);
  const unit = getImageUnitPrice(count);
  const total = Math.round(count * unit * 100) / 100;
  const base = count * 0.07;
  const savings = Math.round((base - total) * 100) / 100;
  const percent = base > 0 ? Math.round((savings / base) * 100) : 0;

  return {
    quantity: count,
    unit,
    total,
    savings,
    percent,
  };
}

export function getVideoSecondQuote(seconds: number, perSecond: number) {
  const count = Math.max(1, Math.round(seconds));
  const total = Math.round(count * perSecond * 100) / 100;

  return {
    seconds: count,
    perSecond,
    total,
  };
}

export function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/** Keeps a per-second rate legible: $0.085, $0.10, $0.072. */
export function formatUSDRate(value: number) {
  const fractionDigits = Math.round(value * 1000) % 10 === 0 ? 2 : 3;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
