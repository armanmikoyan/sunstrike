import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { modelsForMode, toModelOption } from "@/components/studio/utils";
import { offerings } from "@/mocks/offerings";
import { PricingCustomTopUp } from "./pricing-custom-top-up";

const models = offerings.map(toModelOption);
const videoRates = modelsForMode(models, "video");
const imageRates = modelsForMode(models, "image");

function Harness() {
  const [amount, setAmount] = useState(5);

  return (
    <PricingCustomTopUp videoModels={videoRates} imageModels={imageRates} amount={amount} onAmountChange={setAmount} />
  );
}

function renderCard() {
  return render(<Harness />);
}

describe("custom top-up", () => {
  it("starts at the minimum amount", () => {
    renderCard();
    const slider = screen.getByRole("slider", { name: "Custom top-up amount" });
    expect(slider).toHaveAttribute("aria-valuemin", "5");
    expect(slider).toHaveAttribute("aria-valuenow", "5");
    expect(screen.getByRole("button", { name: "Decrease amount" })).toBeDisabled();
  });

  it("steps the amount up one dollar per press", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: "Increase amount" }));

    expect(screen.getByRole("slider", { name: "Custom top-up amount" })).toHaveAttribute("aria-valuenow", "6");
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
