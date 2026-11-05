import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClipStrip } from ".";

describe("clip strip", () => {
  it("prints a dollar price under every clip", () => {
    render(<ClipStrip ids={["01", "02"]} />);
    expect(screen.getAllByText(/^\$\d+\.\d{2}$/)).toHaveLength(2);
  });

  it("skips unknown ids", () => {
    const { container } = render(<ClipStrip ids={["01", "missing"]} />);
    expect(container.querySelectorAll("video")).toHaveLength(1);
  });
});
