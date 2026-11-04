import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RatioMosaic } from "@/components/ratio-mosaic";
import { VideoWall } from "@/components/video-wall";

describe("video wall", () => {
  it("renders the looping columns of clips", () => {
    const { container } = render(<VideoWall />);
    expect(container.querySelectorAll("video").length).toBeGreaterThan(12);
  });
});

describe("ratio mosaic", () => {
  it("names the shapes it shows", () => {
    render(<RatioMosaic />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    for (const ratio of ["9:16", "3:4", "1:1"]) {
      expect(screen.getAllByText(ratio).length).toBeGreaterThan(0);
    }
  });
});
