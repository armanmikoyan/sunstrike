import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("settings page", () => {
  it("opens on the account pane", () => {
    renderWithProviders(<Page />);
    expect(
      screen.getByRole("heading", { name: "Account" }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("arman@chronolab.ai")).toBeInTheDocument();
  });
});
