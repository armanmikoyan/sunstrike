import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BillingPage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("billing page", () => {
  it("shows the balance and auto top-up", () => {
    renderWithProviders(<BillingPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Billing" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Auto top-up")).toBeInTheDocument();
  });
});
