import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NavigationProgress } from ".";
import { FADE_MS, HOLD_MS, NAVIGATION_SETTLED_EVENT, NAVIGATION_START_EVENT, SHOW_DELAY_MS } from "./constants";
import { setPathname } from "~/vitest.setup";

const bar = () => document.querySelector("[data-navigation-progress]") as HTMLElement;

describe("navigation progress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    setPathname("/");
  });

  it("stays hidden on first paint", () => {
    render(<NavigationProgress />);
    expect(bar()).toHaveClass("opacity-0");
  });

  it("shows while a navigation is running", () => {
    render(<NavigationProgress />);
    act(() => {
      window.dispatchEvent(new Event("wildscape:navigation-start"));
    });
    expect(bar()).toHaveClass("opacity-0");

    act(() => {
      vi.advanceTimersByTime(SHOW_DELAY_MS);
    });
    expect(bar()).toHaveClass("opacity-100");
  });

  it("finishes when a link reports its navigation settled", () => {
    render(<NavigationProgress />);
    act(() => {
      window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
      vi.advanceTimersByTime(SHOW_DELAY_MS);
    });
    expect(bar()).toHaveClass("opacity-100");

    // A query-only link never changes the pathname; the settle still ends it.
    act(() => {
      window.dispatchEvent(new Event(NAVIGATION_SETTLED_EVENT));
      vi.advanceTimersByTime(HOLD_MS + FADE_MS + 50);
    });
    expect(bar()).toHaveClass("opacity-0");
  });

  it("ignores plain clicks; links report through their pending state", () => {
    render(<NavigationProgress />);
    const link = document.createElement("a");
    link.href = "/pricing";
    document.body.appendChild(link);

    act(() => {
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      vi.advanceTimersByTime(SHOW_DELAY_MS);
    });

    expect(bar()).toHaveClass("opacity-0");
    link.remove();
  });

  it("ignores query-only history steps", () => {
    render(<NavigationProgress />);

    act(() => {
      window.history.pushState({}, "", "/?q=forest");
      window.dispatchEvent(new PopStateEvent("popstate"));
      vi.advanceTimersByTime(SHOW_DELAY_MS);
    });

    expect(bar()).toHaveClass("opacity-0");
    window.history.pushState({}, "", "/");
  });

  it("ignores hash-only history changes", () => {
    render(<NavigationProgress />);

    act(() => {
      window.history.pushState({}, "", "#model-rates");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(bar()).toHaveClass("opacity-0");
    window.history.pushState({}, "", "/");
  });

  it("never flashes for a navigation that settles immediately", () => {
    const { rerender } = render(<NavigationProgress />);
    act(() => {
      window.dispatchEvent(new Event("wildscape:navigation-start"));
      vi.advanceTimersByTime(SHOW_DELAY_MS - 20);
    });

    setPathname("/pricing");
    rerender(<NavigationProgress />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(bar()).toHaveClass("opacity-0");
  });

  it("hides again once the route settles", () => {
    const { rerender } = render(<NavigationProgress />);
    act(() => {
      window.dispatchEvent(new Event("wildscape:navigation-start"));
      vi.advanceTimersByTime(SHOW_DELAY_MS);
    });
    expect(bar()).toHaveClass("opacity-100");

    setPathname("/pricing");
    rerender(<NavigationProgress />);

    act(() => {
      vi.advanceTimersByTime(HOLD_MS + FADE_MS + 50);
    });

    expect(bar()).toHaveClass("opacity-0");
  });
});
