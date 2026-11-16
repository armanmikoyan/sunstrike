import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("billing settings page", () => {
  it("shows the balance and auto top-up", () => {
    renderWithProviders(<Page />);
    expect(
      screen.getByRole("heading", { name: "Billing" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Auto top-up")).toBeInTheDocument();
    expect(screen.getByText("Available balance")).toBeInTheDocument();
  });
});
