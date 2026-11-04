import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AutoTopUpCard } from "@/components/auto-top-up-card";

describe("auto top-up card", () => {
  it("is on by default and shows the refill amount", () => {
    render(<AutoTopUpCard />);
    expect(screen.getByText("Refills at $5")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("turns off from the switch", async () => {
    render(<AutoTopUpCard />);
    await userEvent.click(screen.getByRole("switch"));

    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(screen.getByText("Off")).toBeInTheDocument();
  });

  it("prices the threshold and pack in dollars", () => {
    render(<AutoTopUpCard />);
    expect(screen.getByText("Threshold").parentElement).toHaveTextContent("$5");
    expect(screen.getByText("Pack").parentElement).toHaveTextContent("$10");
  });
});
