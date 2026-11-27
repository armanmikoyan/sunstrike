import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NAVIGATION_SETTLED_EVENT, NAVIGATION_START_EVENT } from "@/components/navigation-progress/constants";
import { Link } from ".";

const status = vi.hoisted(() => ({ pending: false }));

vi.mock("next/link", async () => {
  const ReactModule = await import("react");
  return {
    __esModule: true,
    default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
      ReactModule.createElement("a", { ...rest, href }, children),
    useLinkStatus: () => ({ pending: status.pending }),
  };
});

describe("Link", () => {
  afterEach(() => {
    status.pending = false;
  });

  it("renders a plain anchor with its children", () => {
    render(<Link href="/pricing">Pricing</Link>);
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/pricing");
  });

  it("reports a pending navigation, then its settle", () => {
    const events: string[] = [];
    const record = (event: Event) => events.push(event.type);
    window.addEventListener(NAVIGATION_START_EVENT, record);
    window.addEventListener(NAVIGATION_SETTLED_EVENT, record);

    const { rerender } = render(<Link href="/pricing">Pricing</Link>);
    expect(events).toEqual([]);

    status.pending = true;
    rerender(<Link href="/pricing">Pricing</Link>);
    status.pending = false;
    rerender(<Link href="/pricing">Pricing</Link>);

    expect(events).toEqual([NAVIGATION_START_EVENT, NAVIGATION_SETTLED_EVENT]);
    window.removeEventListener(NAVIGATION_START_EVENT, record);
    window.removeEventListener(NAVIGATION_SETTLED_EVENT, record);
  });

  it("leaves the finish to the route commit when it unmounts mid-navigation", () => {
    const settled = vi.fn();
    window.addEventListener(NAVIGATION_SETTLED_EVENT, settled);

    status.pending = true;
    const { unmount } = render(<Link href="/pricing">Pricing</Link>);
    unmount();

    expect(settled).not.toHaveBeenCalled();
    window.removeEventListener(NAVIGATION_SETTLED_EVENT, settled);
  });
});
