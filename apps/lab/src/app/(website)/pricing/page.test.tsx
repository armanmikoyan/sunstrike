import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PricingPage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("pricing page", () => {
  it("opens on model rates billed by the second", () => {
    renderWithProviders(<PricingPage />);
    expect(
      screen.getByRole("heading", {
        name: /Every second at the model's price/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/\/ second/).length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: "All models" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("talks about balance and dollars, never credits", () => {
    const { container } = renderWithProviders(<PricingPage />);
    expect(container.textContent).not.toMatch(/credit/i);
    expect(container.textContent).toMatch(/\$\d/);
  });
});
