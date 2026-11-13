import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SettingsView } from ".";
import { currentUser } from "./constants";

describe("settings view", () => {
  it("opens on the account pane", () => {
    render(<SettingsView />);
    expect(screen.getByRole("button", { name: "Account" })).toHaveClass(
      "text-foreground",
    );
    expect(screen.getByDisplayValue(currentUser.email)).toBeInTheDocument();
    expect(screen.getByText(currentUser.id)).toBeInTheDocument();
  });

  it("switches to notifications", async () => {
    render(<SettingsView />);
    await userEvent.click(screen.getByRole("button", { name: "Notifications" }));

    expect(screen.getByRole("button", { name: "Notifications" })).toHaveClass(
      "text-foreground",
    );
    expect(screen.queryByDisplayValue(currentUser.email)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Render (ready|failed)/).length).toBeGreaterThan(
      0,
    );
  });

  it("only shows the sections the model defines", () => {
    render(<SettingsView />);
    expect(screen.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Notifications" }),
    ).toBeInTheDocument();
    for (const label of ["Profile", "Preferences", "Security", "API keys"]) {
      expect(
        screen.queryByRole("button", { name: label }),
      ).not.toBeInTheDocument();
    }
  });
});
