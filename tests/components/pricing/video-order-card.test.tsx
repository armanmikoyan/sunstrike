import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { VideoOrderCard } from "@/components/pricing";

const totalRow = () => screen.getByText("Total").parentElement as HTMLElement;

describe("video order card", () => {
  it("starts at four standard clips", () => {
    render(<VideoOrderCard />);
    expect(totalRow()).toHaveTextContent("$2.04");
    expect(screen.getByRole("link", { name: /Get.*clips/ })).toHaveAttribute(
      "href",
      "/billing",
    );
  });

  it("steps the clip count", async () => {
    render(<VideoOrderCard />);
    await userEvent.click(screen.getByRole("button", { name: "Increase clips" }));
    expect(totalRow()).toHaveTextContent("$2.55");

    await userEvent.click(screen.getByRole("button", { name: "Decrease clips" }));
    expect(totalRow()).toHaveTextContent("$2.04");
  });

  it("stops at one clip", async () => {
    render(<VideoOrderCard />);
    const decrease = screen.getByRole("button", { name: "Decrease clips" });
    for (let index = 0; index < 5; index += 1) {
      if ((decrease as HTMLButtonElement).disabled) break;
      await userEvent.click(decrease);
    }
    expect(decrease).toBeDisabled();
    expect(totalRow()).toHaveTextContent("$0.51");
  });

  it("re-prices when the model changes", async () => {
    render(<VideoOrderCard />);
    await userEvent.click(screen.getByRole("button", { name: /Motion Turbo/ }));
    expect(totalRow()).toHaveTextContent("$1.36");
    expect(
      screen.getByRole("button", { name: /Motion Turbo/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /Motion 2/ }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("shows the per clip rate in dollars", () => {
    render(<VideoOrderCard />);
    const row = screen.getByText("Per clip").parentElement as HTMLElement;
    expect(row).toHaveTextContent("$0.51");
  });

  it("never asks for credits", () => {
    const { container } = render(<VideoOrderCard />);
    expect(container.textContent).not.toMatch(/credit/i);
  });

  it("is a one-time payment", () => {
    render(<VideoOrderCard />);
    expect(
      screen.getByText(/One-time payment · No subscription/),
    ).toBeInTheDocument();
  });
});
