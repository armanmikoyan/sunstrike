import { Provider } from "jotai";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Studio } from ".";
import type { GenerationMode } from "./types";
import { TooltipProvider } from "@/ui/tooltip";

function renderStudio(mode: GenerationMode = "video") {
  return render(
    <Provider>
      <TooltipProvider>
        <Studio initialMode={mode} />
      </TooltipProvider>
    </Provider>,
  );
}

describe("studio", () => {
  it("opens in video mode", () => {
    renderStudio("video");
    expect(screen.getByText("Video Studio")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate video" })).toBeInTheDocument();
  });

  it("opens in image mode", () => {
    renderStudio("image");
    expect(screen.getByText("Image Studio")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate image" })).toBeInTheDocument();
  });

  it("links to the other studio", () => {
    renderStudio("video");
    const links = screen.getAllByRole("link").map((link) => link.getAttribute("href"));

    expect(links).toContain("/create/video");
    expect(links).toContain("/create/image");
  });

  it("prices the generation in dollars", () => {
    renderStudio("video");
    expect(
      screen.getAllByText(
        (_, node) => /^\$0\.\d{2}$/.test(node?.textContent ?? "") && Boolean(node?.classList.contains("tabular-nums")),
      ).length,
    ).toBeGreaterThan(0);
  });

  it("shows the aspect ratio presets", () => {
    renderStudio("video");
    expect(screen.getAllByRole("button", { name: /Landscape|Portrait|Square/ }).length).toBeGreaterThan(0);
  });

  it("attaches a reference file", () => {
    const { container } = renderStudio("video");
    const input = container.querySelector('input[type="file"]');

    expect(input).not.toBeNull();
    fireEvent.change(input as HTMLInputElement, {
      target: {
        files: [new File(["frame"], "frame.png", { type: "image/png" })],
      },
    });

    expect(screen.getByText("frame.png")).toBeInTheDocument();
  });

  it("swaps the template from the dropdown", async () => {
    renderStudio("video");

    await userEvent.click(screen.getByRole("button", { name: "No template" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /Product turntable/ }));

    expect(screen.getByRole("button", { name: "Product turntable" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Product turntable" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /No template/ }));

    expect(screen.getByRole("button", { name: "No template" })).toBeInTheDocument();
  });

  it("returns home from its back control", () => {
    renderStudio("video");
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
  });

  it("does not sell credits", () => {
    const { container } = renderStudio("video");
    expect(container.textContent).not.toMatch(/credit/i);
  });
});
