import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SettingsAccountPane } from "./settings-account-pane";

describe("account pane", () => {
  it("shows the saved email and confirms a save", async () => {
    render(<SettingsAccountPane />);

    expect(screen.getByLabelText("Email")).toHaveValue("arman@wildscape.ai");

    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByRole("button", { name: "Saved" })).toBeInTheDocument();
  });
});
