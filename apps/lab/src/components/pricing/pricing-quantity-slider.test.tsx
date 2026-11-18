import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuantitySlider } from "./pricing-quantity-slider";

const rect = (width: number) =>
  ({
    width,
    height: 32,
    left: 0,
    top: 0,
    right: width,
    bottom: 32,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }) as DOMRect;

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect(200));
});

function renderSlider(value = 5) {
  const onValueChange = vi.fn();
  const { container } = render(
    <QuantitySlider value={value} min={1} max={10} onValueChange={onValueChange} ariaLabel="Quantity" />,
  );
  const wrapper = container.firstElementChild as HTMLElement;
  return { onValueChange, wrapper, slider: screen.getByRole("slider", { name: "Quantity" }) };
}

describe("QuantitySlider", () => {
  it("draws a drum of ticks with major marks", () => {
    renderSlider();

    const ticks = document.querySelectorAll("span[style*='translateZ']");
    expect(ticks).toHaveLength(64);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "5");
  });

  it("moves with the keyboard", () => {
    const { onValueChange, slider } = renderSlider();

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith(6);

    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenCalledWith(4);
  });

  it("drags the drum with the pointer", () => {
    const { onValueChange, wrapper, slider } = renderSlider();
    const focus = vi.spyOn(slider, "focus");

    fireEvent.pointerDown(wrapper, { pointerId: 1, clientX: 100, button: 0, isPrimary: true });
    expect(focus).toHaveBeenCalled();

    fireEvent.pointerMove(wrapper, { pointerId: 1, clientX: 150 });
    // Dragging right uncovers lower values from the left.
    expect(onValueChange).toHaveBeenCalledWith(3);

    fireEvent.pointerUp(wrapper, { pointerId: 1 });
    onValueChange.mockClear();
    fireEvent.pointerMove(wrapper, { pointerId: 1, clientX: 190 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("clamps the drag at both ends of the range", () => {
    const { onValueChange, wrapper } = renderSlider(5);

    fireEvent.pointerDown(wrapper, { pointerId: 1, clientX: 100, button: 0, isPrimary: true });
    fireEvent.pointerMove(wrapper, { pointerId: 1, clientX: -500 });
    expect(onValueChange).toHaveBeenLastCalledWith(10);

    fireEvent.pointerMove(wrapper, { pointerId: 1, clientX: 5000 });
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it("ignores a secondary button and a foreign pointer", () => {
    const { onValueChange, wrapper, slider } = renderSlider();
    const focus = vi.spyOn(slider, "focus");

    fireEvent.pointerDown(wrapper, { pointerId: 1, clientX: 100, button: 2, isPrimary: true });
    expect(focus).not.toHaveBeenCalled();

    fireEvent.pointerDown(wrapper, { pointerId: 2, clientX: 100, button: 0, isPrimary: true });
    onValueChange.mockClear();
    fireEvent.pointerMove(wrapper, { pointerId: 3, clientX: 150 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("ends the drag when the pointer is cancelled or lost", () => {
    const { onValueChange, wrapper } = renderSlider();

    fireEvent.pointerDown(wrapper, { pointerId: 1, clientX: 100, button: 0, isPrimary: true });
    fireEvent.pointerCancel(wrapper, { pointerId: 1 });
    onValueChange.mockClear();
    fireEvent.pointerMove(wrapper, { pointerId: 1, clientX: 150 });
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.pointerDown(wrapper, { pointerId: 2, clientX: 100, button: 0, isPrimary: true });
    fireEvent.lostPointerCapture(wrapper, { pointerId: 2 });
    onValueChange.mockClear();
    fireEvent.pointerMove(wrapper, { pointerId: 2, clientX: 150 });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
