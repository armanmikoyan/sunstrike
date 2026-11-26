import type { GenerationProvider } from "@/modules/generations";
import { FAKE_PROVIDER, PLACEHOLDER_PNG_BASE64 } from "./constants";
import { asksToFail } from "./utils";

const placeholder = Buffer.from(PLACEHOLDER_PNG_BASE64, "base64");

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Renders nothing: waits a moment, then returns a 1×1 placeholder image, or a
 * final failure when the prompt contains the fail marker. Stands in for Runware.
 */
export const fakeProvider: GenerationProvider = {
  name: FAKE_PROVIDER.name,
  async run(job) {
    await sleep(FAKE_PROVIDER.renderDelayMs);

    if (asksToFail(job.prompt)) return { ok: false, code: FAKE_PROVIDER.failureCode, retryable: false };

    return { ok: true, output: { contentType: "image/png", body: placeholder } };
  },
};
