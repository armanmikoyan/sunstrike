import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SettingsView } from "@/components/shared/settings-view";

describe("settings view", () => {
  it("opens on the profile pane", () => {
    render(<SettingsView />);
    expect(screen.getByRole("button", { name: "Profile" })).toHaveClass(
      "text-foreground",
    );
    expect(screen.getByDisplayValue("Arman Mikoyan")).toBeInTheDocument();
  });

  it("switches panes", async () => {
    render(<SettingsView />);
    await userEvent.click(screen.getByRole("button", { name: "Preferences" }));

    expect(screen.getByRole("button", { name: "Preferences" })).toHaveClass(
      "text-foreground",
    );
    expect(screen.queryByDisplayValue("Arman Mikoyan")).not.toBeInTheDocument();
  });

  it("masks and reveals the API key", async () => {
    render(<SettingsView />);
    await userEvent.click(screen.getByRole("button", { name: "Security" }));

    const toggle = screen.getByRole("button", { name: "Show API key" });
    await userEvent.click(toggle);

    expect(
      screen.getByRole("button", { name: "Hide API key" }),
    ).toBeInTheDocument();
  });

  it("shows every settings section", () => {
    render(<SettingsView />);
    for (const label of [
      "Profile",
      "Preferences",
      "Notifications",
      "Security",
      "API keys",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });
});
