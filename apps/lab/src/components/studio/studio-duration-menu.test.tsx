import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StudioDurationMenu } from "./studio-duration-menu";

function renderMenu(options = [4, 6, 7, 8], value = 6) {
  const onValueChange = vi.fn();

  render(<StudioDurationMenu options={options} value={value} onValueChange={onValueChange} label="Duration" />);

  return { onValueChange };
}

describe("studio duration menu", () => {
  it("shows the chosen duration and keeps the track hidden until opened", async () => {
    renderMenu();

    expect(screen.getByRole("button", { name: "Duration: 6s" })).toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "Duration" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Duration: 6s" }));

    expect(screen.getByRole("slider", { name: "Duration" })).toBeInTheDocument();
  });

  it("steps through the allowed durations from the track", async () => {
    const { onValueChange } = renderMenu([4, 6, 7, 8], 4);

    await userEvent.click(screen.getByRole("button", { name: "Duration: 4s" }));
    screen.getByRole("slider", { name: "Duration" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith(6);
  });

  it("does not open when the model has one duration", async () => {
    renderMenu([5], 5);

    const trigger = screen.getByRole("button", { name: "Duration: 5s" });

    expect(trigger).toBeDisabled();

    await userEvent.click(trigger);

    expect(screen.queryByRole("slider", { name: "Duration" })).not.toBeInTheDocument();
  });
});
