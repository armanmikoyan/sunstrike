import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StudioDurationSlider } from "./studio-duration-slider";

function renderSlider(options: number[], value: number) {
  const onValueChange = vi.fn();

  render(<StudioDurationSlider options={options} value={value} onValueChange={onValueChange} label="Duration" />);

  return { onValueChange, slider: screen.getByRole("slider", { name: "Duration" }) };
}

describe("studio duration slider", () => {
  it("shows the range and the chosen duration, and speaks it in seconds", () => {
    const { slider } = renderSlider([4, 6, 7, 8], 6);

    expect(screen.getByText("4–8s")).toBeInTheDocument();
    expect(screen.getByText("6s")).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuetext", "6 seconds");
  });

  it("steps through the allowed durations only", () => {
    const { onValueChange, slider } = renderSlider([4, 6, 7, 8], 4);

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(onValueChange).toHaveBeenCalledWith(6);
  });

  it("is disabled when the model has one duration", () => {
    const { slider } = renderSlider([5], 5);

    expect(slider).toHaveAttribute("data-disabled");
    expect(screen.getByText("5s", { selector: "span:first-child" })).toBeInTheDocument();
  });
});
