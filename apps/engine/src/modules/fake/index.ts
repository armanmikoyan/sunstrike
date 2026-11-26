import { fakeProvider } from "./providers";

/**
 * Temporary dev stand-ins for services we cannot pay for yet: a provider that
 * renders a placeholder instead of Runware, and top-ups without Lemon Squeezy.
 * Delete this module once both real integrations exist.
 */
export const fake = {
  provider: fakeProvider,
};
