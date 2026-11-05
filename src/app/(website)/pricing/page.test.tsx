import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PricingPage from "./page";
import { renderWithProviders } from "~/vitest.setup";

describe("pricing page", () => {
  it("opens on the video calculator", () => {
    renderWithProviders(<PricingPage />);
    expect(screen.getByText(/Pay for output/)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Video" })).toBeInTheDocument();
  });

  it("talks about balance and dollars, never credits", () => {
    const { container } = renderWithProviders(<PricingPage />);
    expect(container.textContent).not.toMatch(/credit/i);
    expect(container.textContent).toMatch(/\$\d/);
  });
});
