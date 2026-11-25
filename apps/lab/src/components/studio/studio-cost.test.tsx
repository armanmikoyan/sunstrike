import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudioCost } from "./studio-cost";

describe("studio cost", () => {
  it("pulses until the quote arrives", () => {
    const { container } = render(<StudioCost cost={{ total: null, pending: true }} />);

    expect(screen.getByText("Calculating price")).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(container.textContent).not.toMatch(/\$/);
  });

  it("shows the quoted price in dollars", () => {
    const { container } = render(<StudioCost cost={{ total: 0.425, pending: false }} />);

    expect(screen.getByText("$0.43")).toHaveClass("tabular-nums");
    expect(container.querySelector(".animate-spin")).toBeNull();
    expect(screen.queryByText("Calculating price")).not.toBeInTheDocument();
  });

  it("keeps the last price dimmed with a spinner while a new quote is on its way", () => {
    const { container } = render(<StudioCost cost={{ total: 0.425, pending: true }} />);

    expect(screen.getByText("$0.43")).toHaveClass("opacity-50");
    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(screen.getByText("Calculating price")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
  });
});
