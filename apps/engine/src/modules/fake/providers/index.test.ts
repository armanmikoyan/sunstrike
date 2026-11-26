import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProviderJob } from "@/modules/generations";
import { fakeProvider } from "./index";

const job: ProviderJob = {
  generationId: "99999999-9999-4999-8999-999999999999",
  modelId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  prompt: "a lighthouse",
  settings: { mode: "image", resolution: "1024", aspectRatio: "1:1", durationSeconds: null, audio: false },
  inputs: [],
};

async function run(prompt: string | null) {
  const result = fakeProvider.run({ ...job, prompt });
  await vi.runAllTimersAsync();
  return result;
}

describe("fake provider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a placeholder PNG", async () => {
    const result = await run("a lighthouse");

    expect(result.ok && result.output.contentType).toBe("image/png");
    expect(result.ok && result.output.body.subarray(1, 4).toString()).toBe("PNG");
  });

  it("fails for good when the prompt asks to", async () => {
    await expect(run("a lighthouse [FAIL]")).resolves.toEqual({ ok: false, code: "fake_failure", retryable: false });
  });

  it("takes a moment, like a real render", async () => {
    let settled = false;
    const pending = fakeProvider.run(job).finally(() => {
      settled = true;
    });

    await vi.advanceTimersByTimeAsync(2999);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(settled).toBe(true);
    await pending;
  });
});
