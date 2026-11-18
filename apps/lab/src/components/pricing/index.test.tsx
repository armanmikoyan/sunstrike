import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/vitest.setup";
import { Pricing } from ".";

describe("pricing", () => {
  it("opens on model rates billed by the second", () => {
    renderWithProviders(<Pricing />);

    expect(
      screen.getByRole("heading", {
        name: /Every second at the model's price/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/\/ second/).length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: "All models" })).toHaveAttribute("aria-selected", "true");
  });

  it("filters the catalogue down to image models", async () => {
    renderWithProviders(<Pricing />);

    await userEvent.click(screen.getByRole("tab", { name: "Image models" }));

    const rates = within(screen.getByRole("region", { name: "Model rates" }));
    expect(rates.queryByText("Chronolab Motion 2")).not.toBeInTheDocument();
    expect(rates.getAllByText("/ image").length).toBeGreaterThan(0);
  });

  it("talks about balance and dollars, never credits", () => {
    const { container } = renderWithProviders(<Pricing />);

    expect(container.textContent).not.toMatch(/credit/i);
    expect(container.textContent).toMatch(/\$\d/);
  });
});
