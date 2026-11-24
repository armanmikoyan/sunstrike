import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Assets } from ".";
import { assetItems } from "@/mocks/media";

const visibleTiles = () => screen.getAllByRole("img");

describe("assets", () => {
  it("lists every asset and narrows the grid to one kind", async () => {
    render(<Assets />);

    expect(visibleTiles()).toHaveLength(assetItems.length);

    await userEvent.click(screen.getByRole("tab", { name: "Video" }));

    expect(visibleTiles()).toHaveLength(assetItems.filter((asset) => asset.kind === "video").length);
  });

  it("opens the file picker from the upload control", async () => {
    const { container } = render(<Assets />);
    const input = container.querySelector('input[type="file"]');
    const click = vi.spyOn(input as HTMLInputElement, "click");

    await userEvent.click(screen.getByRole("button", { name: "Upload" }));

    expect(click).toHaveBeenCalledTimes(1);
  });
});
