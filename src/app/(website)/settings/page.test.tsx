import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SettingsPage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("settings page", () => {
  it("opens on the profile pane", () => {
    renderWithProviders(<SettingsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
  });
});
