import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegalContents } from "./legal-contents";
import { activationTargets } from "./utils";

describe("activationTargets", () => {
  it("uses the heading offset for sections that can reach the reading line", () => {
    expect(activationTargets([100, 500, 900], 2_000)).toEqual([0, 360, 760]);
    expect(activationTargets([100, 500, 900], 2_000, 400)).toEqual([0, 100, 500]);
  });

  it("lets the first item own the top of the page", () => {
    // The first two headings sit high on the page; the rail must still open
    // on Overview rather than its neighbour.
    expect(activationTargets([239, 390, 647], 1_569)).toEqual([0, 250, 507]);
  });

  it("pins the final item to the bottom and pulls the tail back", () => {
    expect(activationTargets([100, 500, 900, 1_100], 800)).toEqual([0, 360, 710, 800]);
  });

  it("keeps at least 90px of scroll between the final sections", () => {
    expect(activationTargets([100, 500, 900, 1_100, 1_300], 800)).toEqual([0, 360, 620, 710, 800]);
  });

  it("keeps the first and last item when the page can barely scroll", () => {
    expect(activationTargets([500, 600], 100)).toEqual([0, 100]);
    expect(activationTargets([500, 600, 700], 100)).toEqual([0, 10, 100]);
  });
});

describe("legal contents scroll spy", () => {
  const sections = [
    { id: "overview", title: "Overview" },
    { id: "cookies", title: "Cookies" },
  ];
  const tops: Record<string, number> = { overview: 100, cookies: 1_600 };
  let scrollY = 0;

  beforeEach(() => {
    scrollY = 0;
    for (const section of sections) {
      const element = document.createElement("section");
      element.id = section.id;
      document.body.appendChild(element);
    }

    vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollY);
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(2_400);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      const top = (tops[this.id] ?? 0) - scrollY;
      return {
        top,
        left: 0,
        right: 0,
        bottom: top + 100,
        width: 100,
        height: 100,
        x: 0,
        y: top,
        toJSON: () => ({}),
      };
    });
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 0;
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("follows the section crossing the reading line", async () => {
    render(<LegalContents sections={sections} contactEmail="support@chronolab.ai" />);

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "location");

    scrollY = 1_500;
    fireEvent.scroll(window);

    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Cookies" })).toHaveAttribute("aria-current", "location"),
    );
  });

  it("keeps a clicked section until the reader scrolls again", async () => {
    render(<LegalContents sections={sections} contactEmail="support@chronolab.ai" />);

    fireEvent.click(screen.getByRole("link", { name: "Cookies" }));
    scrollY = 0;
    fireEvent.scroll(window);
    expect(screen.getByRole("link", { name: "Cookies" })).toHaveAttribute("aria-current", "location");

    fireEvent.wheel(window);
    await waitFor(() =>
      expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "location"),
    );
  });
});
