import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setPathname } from "~/vitest.setup";
import { SettingsNav } from "./settings-nav";

describe("settings nav", () => {
  it("links every settings section to its own path", () => {
    setPathname("/settings/account");
    render(<SettingsNav />);

    expect(screen.getByRole("link", { name: "Account" })).toHaveAttribute(
      "href",
      "/settings/account",
    );
    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute(
      "href",
      "/settings/notifications",
    );
    expect(screen.getByRole("link", { name: "Billing" })).toHaveAttribute(
      "href",
      "/settings/billing",
    );
    expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute(
      "href",
      "/settings/usage",
    );
  });

  it("marks only the current section", () => {
    setPathname("/settings/billing");
    render(<SettingsNav />);

    expect(screen.getByRole("link", { name: "Billing" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Account" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("keeps account active only on the exact settings path", () => {
    setPathname("/settings/notifications");
    render(<SettingsNav />);

    expect(
      screen.getByRole("link", { name: "Account" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByRole("link", { name: "Notifications" }),
    ).toHaveAttribute("aria-current", "page");
  });
});
