import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MosaicTile } from "./mosaic-tile";

describe("mosaic tile", () => {
  it("labels a video and shows its cost when asked", () => {
    render(<MosaicTile id="09" label="9:16" span="" showCost />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/create/video");
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText(/^\$\d\.\d{2}$/)).toBeInTheDocument();
  });

  it("labels a still and omits the cost by default", () => {
    render(<MosaicTile id="05" label="3:4" span="" />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/create/image");
    expect(screen.getByText("Image")).toBeInTheDocument();
    expect(screen.queryByText(/^\$\d\.\d{2}$/)).not.toBeInTheDocument();
  });

  it("renders nothing for an unknown asset", () => {
    const { container } = render(<MosaicTile id="missing" label="1:1" span="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
