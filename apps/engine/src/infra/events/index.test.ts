import { describe, expect, it, vi } from "vitest";

vi.mock("@/infra/logger", () => ({ logger: { error: vi.fn() } }));

import { logger } from "@/infra/logger";
import { publish, subscribe } from ".";

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("events", () => {
  it("delivers a payload to every listener until it stops listening", async () => {
    const handler = vi.fn();
    const stop = subscribe("test.delivered", handler);

    publish("test.delivered", { id: 1 });
    await settle();
    stop();
    publish("test.delivered", { id: 2 });
    await settle();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ id: 1 });
  });

  it("logs a failing handler instead of throwing at the publisher", async () => {
    const stop = subscribe("test.failing", async () => {
      throw new Error("boom");
    });

    expect(() => publish("test.failing", {})).not.toThrow();
    await settle();
    stop();

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ event: "test.failing" }),
      "Event handler failed",
    );
  });
});
