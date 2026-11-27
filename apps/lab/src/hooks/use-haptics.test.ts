import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useHaptics } from "./use-haptics";

function stubVibrate() {
  const vibrate = vi.fn();
  Object.defineProperty(navigator, "vibrate", { configurable: true, value: vibrate });
  return vibrate;
}

describe("useHaptics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "vibrate", { configurable: true, value: undefined });
  });

  it("pulses through the Vibration API", () => {
    const vibrate = stubVibrate();
    const { result } = renderHook(() => useHaptics());

    result.current.pulse(12);

    expect(vibrate).toHaveBeenCalledWith(12);
  });

  it("rate-limits drag ticks so a fast drag does not buzz", () => {
    const vibrate = stubVibrate();
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const { result } = renderHook(() => useHaptics());

    result.current.tick();
    result.current.tick();
    expect(vibrate).toHaveBeenCalledTimes(1);

    now = 100;
    result.current.tick();
    expect(vibrate).toHaveBeenCalledTimes(2);
  });

  it("is silent where the platform has no Vibration API", () => {
    Object.defineProperty(navigator, "vibrate", { configurable: true, value: undefined });
    const { result } = renderHook(() => useHaptics());

    expect(() => result.current.pulse()).not.toThrow();
    expect(() => result.current.tick()).not.toThrow();
  });
});
