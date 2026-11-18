import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SegmentedSlider } from "./segmented-slider";

const context = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  roundRect: vi.fn(),
  fill: vi.fn(),
  fillStyle: "",
};

const rect = (width: number, left = 0) =>
  ({
    width,
    height: 24,
    left,
    top: 0,
    right: left + width,
    bottom: 24,
    x: left,
    y: 0,
    toJSON: () => ({}),
  }) as DOMRect;

let resize: (() => void) | null = null;

beforeEach(() => {
  context.clearRect.mockClear();
  context.beginPath.mockClear();
  context.roundRect.mockClear();
  context.fill.mockClear();
  resize = null;

  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as never);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect(440, 0.5));
  vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

  class Observer {
    constructor(callback: () => void) {
      resize = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, "ResizeObserver", { writable: true, value: Observer });
});

function renderSlider(overrides: Partial<ComponentProps<typeof SegmentedSlider>> = {}) {
  const onValueChange = vi.fn();
  render(
    <SegmentedSlider
      value={1000}
      min={100}
      max={10000}
      step={100}
      onValueChange={onValueChange}
      label="Top-up amount"
      {...overrides}
    />,
  );
  return { onValueChange, slider: screen.getByRole("slider", { name: "Top-up amount" }) };
}

describe("SegmentedSlider", () => {
  it("draws the ticks on the canvas", () => {
    renderSlider();

    expect(context.clearRect).toHaveBeenCalled();
    expect(context.roundRect).toHaveBeenCalled();
    expect(context.fill).toHaveBeenCalled();
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "$1,000");
  });

  it("redraws when the track resizes", () => {
    renderSlider();
    context.clearRect.mockClear();
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue(rect(330, 0.5));

    act(() => resize?.());

    expect(context.clearRect).toHaveBeenCalled();
  });

  it("steps with the arrow, page and boundary keys", () => {
    const { onValueChange, slider } = renderSlider();

    for (const key of ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"]) {
      fireEvent.keyDown(slider, { key });
    }
    expect(onValueChange).toHaveBeenCalledTimes(4);
    expect(onValueChange).toHaveBeenNthCalledWith(1, 1100);
    expect(onValueChange).toHaveBeenNthCalledWith(3, 900);

    onValueChange.mockClear();
    fireEvent.keyDown(slider, { key: "PageUp" });
    fireEvent.keyDown(slider, { key: "PageDown" });
    expect(onValueChange).toHaveBeenNthCalledWith(1, 1500);
    expect(onValueChange).toHaveBeenNthCalledWith(2, 500);

    onValueChange.mockClear();
    fireEvent.keyDown(slider, { key: "Home" });
    fireEvent.keyDown(slider, { key: "End" });
    expect(onValueChange).toHaveBeenNthCalledWith(1, 100);
    expect(onValueChange).toHaveBeenNthCalledWith(2, 10000);
  });

  it("ignores keys it does not use", () => {
    const { onValueChange, slider } = renderSlider();

    fireEvent.keyDown(slider, { key: "Tab" });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("clamps a value below the minimum", () => {
    const { onValueChange, slider } = renderSlider({ value: 100 });

    fireEvent.keyDown(slider, { key: "Home" });
    fireEvent.keyDown(slider, { key: "ArrowLeft" });

    expect(onValueChange).toHaveBeenLastCalledWith(100);
  });

  it("follows the pointer while dragging", () => {
    const { onValueChange, slider } = renderSlider();

    fireEvent.pointerDown(slider, { pointerId: 1, clientX: 220 });
    expect(onValueChange).toHaveBeenCalledTimes(1);

    fireEvent.pointerMove(slider, { pointerId: 1, clientX: 320 });
    expect(onValueChange).toHaveBeenCalledTimes(2);

    fireEvent.pointerUp(slider, { pointerId: 1 });
    fireEvent.pointerMove(slider, { pointerId: 1, clientX: 380 });
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("clamps a drag past either end", () => {
    const { onValueChange, slider } = renderSlider();

    fireEvent.pointerDown(slider, { pointerId: 1, clientX: -500 });
    expect(onValueChange).toHaveBeenLastCalledWith(100);

    fireEvent.pointerMove(slider, { pointerId: 1, clientX: 5000 });
    expect(onValueChange).toHaveBeenLastCalledWith(10000);
  });

  it("stops dragging when the pointer is cancelled", () => {
    const { onValueChange, slider } = renderSlider();

    fireEvent.pointerDown(slider, { pointerId: 1, clientX: 220 });
    fireEvent.pointerCancel(slider, { pointerId: 1 });
    onValueChange.mockClear();
    fireEvent.pointerMove(slider, { pointerId: 1, clientX: 320 });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("measures again when the window resizes", () => {
    renderSlider();
    context.clearRect.mockClear();
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue(rect(220, 0.5));

    act(() => {
      fireEvent(window, new Event("resize"));
    });

    expect(context.clearRect).toHaveBeenCalled();
  });
});
