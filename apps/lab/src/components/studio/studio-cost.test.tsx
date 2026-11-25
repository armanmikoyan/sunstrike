import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudioCost } from "./studio-cost";

describe("studio cost", () => {
  it("pulses until the quote arrives", () => {
    const { container } = render(<StudioCost cost={null} />);

    expect(screen.getByText("Calculating price")).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(container.textContent).not.toMatch(/\$/);
  });

  it("shows the quoted price in dollars", () => {
    render(<StudioCost cost={0.425} />);

    expect(screen.getByText("$0.43")).toHaveClass("tabular-nums");
  });
});
