import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoWall } from ".";

describe("video wall", () => {
  it("repeats every column for a seamless loop", () => {
    const { container } = render(<VideoWall />);
    const tiles = container.querySelectorAll("video, img");

    expect(tiles).toHaveLength(30);
  });

  it("preloads only the first frame of the leading columns", () => {
    const { container } = render(<VideoWall />);
    const videos = container.querySelectorAll("video");

    expect(videos[0]).toHaveAttribute("preload", "auto");
    expect(videos[1]).toHaveAttribute("preload", "metadata");
  });
});
