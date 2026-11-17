import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { imageRates, videoRates } from "@/mocks/pricing";
import { PricingTopUps } from "./pricing-top-ups";

function renderTopUps() {
  return render(
    <PricingTopUps videoModels={videoRates} imageModels={imageRates} />,
  );
}

describe("top-up presets", () => {
  it("offers six presets from $5 to $10,000", () => {
    renderTopUps();

    const presets = screen
      .getAllByRole("button", { name: /^Select \$/ })
      .map((button) => button.getAttribute("aria-label"));

    expect(presets).toEqual([
      "Select $5",
      "Select $50",
      "Select $250",
      "Select $1000",
      "Select $5000",
      "Select $10000",
    ]);
  });

  it("starts on the most popular preset", async () => {
    renderTopUps();

    expect(
      screen.getByRole("slider", { name: "Custom top-up amount" }),
    ).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByRole("button", { name: "Select $50" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Most popular")).toBeInTheDocument();
  });

  it("moves the custom amount when a preset is picked", async () => {
    renderTopUps();
    const slider = screen.getByRole("slider", { name: "Custom top-up amount" });

    await userEvent.click(screen.getByRole("button", { name: "Select $5000" }));

    expect(slider).toHaveAttribute("aria-valuenow", "5000");
    expect(
      screen.getByRole("button", { name: "Select $5000" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Select $5" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("lights the nearest preset while the amount sits between two", async () => {
    renderTopUps();

    await userEvent.click(screen.getByRole("button", { name: "Select $50" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Decrease amount" }),
    );

    expect(
      screen.getByRole("slider", { name: "Custom top-up amount" }),
    ).toHaveAttribute("aria-valuenow", "49");
    expect(screen.getByRole("button", { name: "Select $50" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("steps the amount one dollar at a time", async () => {
    renderTopUps();
    const slider = screen.getByRole("slider", { name: "Custom top-up amount" });

    await userEvent.click(
      screen.getByRole("button", { name: "Increase amount" }),
    );

    expect(slider).toHaveAttribute("aria-valuenow", "51");
  });

  it("falls back to the lower preset when the amount is far below the next", async () => {
    renderTopUps();
    const slider = screen.getByRole("slider", { name: "Custom top-up amount" });

    slider.focus();
    await userEvent.keyboard("{Home}");
    for (let step = 0; step < 15; step += 1) {
      await userEvent.keyboard("{ArrowRight}");
    }

    expect(slider).toHaveAttribute("aria-valuenow", "20");
    expect(screen.getByRole("button", { name: "Select $5" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("keeps the tiles in sync when the slider moves off a preset", async () => {
    renderTopUps();
    const slider = screen.getByRole("slider", { name: "Custom top-up amount" });

    await userEvent.click(screen.getByRole("button", { name: "Select $5000" }));
    slider.focus();
    await userEvent.keyboard("{End}");

    expect(slider).toHaveAttribute("aria-valuenow", "10000");
    expect(
      screen.getByRole("button", { name: "Select $5000" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: "Select $10000" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
