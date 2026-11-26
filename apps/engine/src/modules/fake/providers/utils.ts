import { FAKE_PROVIDER } from "./constants";

/** A prompt containing the fail marker makes the fake provider fail, to exercise the refund path. */
export function asksToFail(prompt: string | null): boolean {
  return prompt?.toLowerCase().includes(FAKE_PROVIDER.failMarker) ?? false;
}
