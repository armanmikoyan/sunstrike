import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NavigationProgress } from ".";
import { FADE_MS, MIN_VISIBLE_MS, SHOW_DELAY_MS } from "./constants";
import { setPathname } from "~/vitest.setup";

const bar = () => document.querySelector('[aria-hidden="true"]') as HTMLElement;

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

  it("reacts to internal link clicks", () => {
    render(<NavigationProgress />);
    const link = document.createElement("a");
    link.href = "/pricing";
    document.body.appendChild(link);

    act(() => {
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      vi.advanceTimersByTime(SHOW_DELAY_MS);
    });

    expect(bar()).toHaveClass("opacity-100");
    link.remove();
  });

  it("ignores external links and modified clicks", () => {
    render(<NavigationProgress />);
    const link = document.createElement("a");
    link.href = "https://example.com";
    document.body.appendChild(link);

    act(() => {
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    expect(bar()).toHaveClass("opacity-0");

    link.href = "/pricing";
    act(() => {
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          metaKey: true,
        }),
      );
    });
    expect(bar()).toHaveClass("opacity-0");
    link.remove();
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
      vi.advanceTimersByTime(MIN_VISIBLE_MS + FADE_MS + 50);
    });

    expect(bar()).toHaveClass("opacity-0");
  });
});
