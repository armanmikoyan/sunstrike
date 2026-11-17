import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoWall } from ".";

describe("video wall", () => {
  it("renders the looping columns of clips", () => {
    const { container } = render(<VideoWall />);
    expect(container.querySelectorAll("video").length).toBeGreaterThan(12);
  });
});
