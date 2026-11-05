import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ImageOrderCard } from ".";

const totalRow = () => screen.getByText("Total").parentElement as HTMLElement;

describe("image order card", () => {
  it("starts at ten images on the middle tier", () => {
    render(<ImageOrderCard />);
    expect(totalRow()).toHaveTextContent("$0.60");
    expect(screen.getByText("Per image").parentElement).toHaveTextContent(
      "$0.06",
    );
  });

  it("steps the image count and re-prices", async () => {
    render(<ImageOrderCard />);
    await userEvent.click(screen.getByRole("button", { name: "Increase images" }));
    expect(totalRow()).toHaveTextContent("$0.66");
    await userEvent.click(screen.getByRole("button", { name: "Decrease images" }));
    expect(totalRow()).toHaveTextContent("$0.60");
  });

  it("applies the volume tier from the preset buttons", async () => {
    render(<ImageOrderCard />);
    await userEvent.click(screen.getByRole("button", { name: /50–500/ }));

    expect(screen.getByRole("button", { name: /50–500/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("Per image").parentElement).toHaveTextContent(
      "$0.05",
    );
    expect(totalRow()).toHaveTextContent("$2.50");
  });

  it("surfaces the volume saving above the base tier", async () => {
    render(<ImageOrderCard />);
    await userEvent.click(screen.getByRole("button", { name: /50–500/ }));
    expect(screen.getByText("Volume saving").parentElement).toHaveTextContent(
      "−$1.00",
    );
  });

  it("hides the saving on the base tier", async () => {
    render(<ImageOrderCard />);
    await userEvent.click(screen.getByRole("button", { name: /^1–9/ }));
    expect(screen.getByText("Volume saving").parentElement).toHaveClass(
      "invisible",
    );
  });

  it("caps the slider at 500 images", () => {
    render(<ImageOrderCard />);
    const slider = screen.getByRole("slider", { name: "Number of images" });
    expect(slider).toHaveAttribute("aria-valuemax", "500");
    expect(slider).toHaveAttribute("aria-valuemin", "1");
  });

  it("never asks for credits", () => {
    const { container } = render(<ImageOrderCard />);
    expect(container.textContent).not.toMatch(/credit/i);
  });
});
