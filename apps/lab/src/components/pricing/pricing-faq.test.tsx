import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PricingFaq } from "./pricing-faq";

describe("pricing faq", () => {
  it("starts with every answer collapsed", () => {
    render(<PricingFaq />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("opens one answer at a time", async () => {
    render(<PricingFaq />);
    const billing = screen.getByRole("button", {
      name: "How does billing work?",
    });
    const subscription = screen.getByRole("button", {
      name: "Is there a subscription?",
    });

    await userEvent.click(billing);
    expect(billing).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(subscription);
    expect(subscription).toHaveAttribute("aria-expanded", "true");
    expect(billing).toHaveAttribute("aria-expanded", "false");
  });
});
