import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RouteWarmup } from ".";
import { WARM_FALLBACK_MS, WARM_ROUTES } from "./constants";
import { routerMock, setPathname } from "~/vitest.setup";

describe("route warmup", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    routerMock.prefetch.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    setPathname("/");
  });

  it("warms the primary destinations once the app is idle", () => {
    render(<RouteWarmup />);

    expect(routerMock.prefetch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(WARM_FALLBACK_MS);
    });

    expect(routerMock.prefetch.mock.calls.map(([href]) => href)).toEqual([...WARM_ROUTES]);
  });

  it("skips the current route and never warms a route twice", () => {
    setPathname("/pricing");
    const { rerender } = render(<RouteWarmup />);

    act(() => {
      vi.advanceTimersByTime(WARM_FALLBACK_MS);
    });

    expect(routerMock.prefetch.mock.calls.map(([href]) => href)).not.toContain("/pricing");

    rerender(<RouteWarmup />);
    act(() => {
      vi.advanceTimersByTime(WARM_FALLBACK_MS);
    });

    const warmed = routerMock.prefetch.mock.calls.map(([href]) => href);
    expect(new Set(warmed).size).toBe(warmed.length);
  });
});
