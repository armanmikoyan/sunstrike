import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from ".";

describe("site footer", () => {
  it("links to the studio areas", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /Video studio/ })).toHaveAttribute(
      "href",
      "/create/video",
    );
    expect(screen.getByRole("link", { name: /Billing/ })).toHaveAttribute(
      "href",
      "/billing",
    );
  });

  it("does not promise credits that expire", () => {
    const { container } = render(<SiteFooter />);
    expect(container.textContent).toMatch(/no expiring balance/i);
    expect(container.textContent).not.toMatch(/credit/i);
  });
});
