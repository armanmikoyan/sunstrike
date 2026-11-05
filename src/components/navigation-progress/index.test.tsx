import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NavigationProgress } from ".";
import { setPathname } from "~/vitest.setup";

const bar = () => document.querySelector('[aria-hidden="true"]') as HTMLElement;

describe("navigation progress", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays hidden on first paint", () => {
    render(<NavigationProgress />);
    expect(bar()).toHaveClass("opacity-0");
  });

  it("shows while a navigation is running", () => {
    render(<NavigationProgress />);
    act(() => {
      window.dispatchEvent(new Event("chronolab:navigation-start"));
    });
    expect(bar()).toHaveClass("opacity-100");
  });

  it("reacts to internal link clicks", () => {
    render(<NavigationProgress />);
    const link = document.createElement("a");
    link.href = "/pricing";
    document.body.appendChild(link);

    act(() => {
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
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
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
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

  it("hides again once the route settles", () => {
    const { rerender } = render(<NavigationProgress />);
    act(() => {
      window.dispatchEvent(new Event("chronolab:navigation-start"));
    });
    expect(bar()).toHaveClass("opacity-100");

    setPathname("/pricing");
    rerender(<NavigationProgress />);

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(bar()).toHaveClass("opacity-0");
  });
});
