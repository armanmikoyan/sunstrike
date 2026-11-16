import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { imageRates, videoRates } from "@/mocks/pricing";
import { PricingCustomTopUp } from "./pricing-custom-top-up";

function renderCard() {
  return render(
    <PricingCustomTopUp videoModels={videoRates} imageModels={imageRates} />,
  );
}

describe("custom top-up", () => {
  it("starts at the minimum amount", () => {
    renderCard();
    const slider = screen.getByRole("slider", { name: "Custom top-up amount" });
    expect(slider).toHaveAttribute("aria-valuemin", "5");
    expect(slider).toHaveAttribute("aria-valuenow", "5");
    expect(
      screen.getByRole("button", { name: "Decrease amount" }),
    ).toBeDisabled();
  });

  it("keeps the preset buttons in sync with the amount", () => {
    renderCard();
    expect(screen.getByRole("button", { name: "$20" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows the selected model's rate and asset estimate in the box", async () => {
    renderCard();

    expect(screen.getByText("$0.085")).toBeInTheDocument();
    expect(screen.getByText(/\/ second/)).toBeInTheDocument();
    expect(screen.getByText("videos")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Image" }));

    expect(screen.getByText("$0.07")).toBeInTheDocument();
    expect(screen.getByText("/ image")).toBeInTheDocument();
    expect(screen.getByText("images")).toBeInTheDocument();
  });
});
