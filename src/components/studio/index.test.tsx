import { Provider } from "jotai";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Studio } from ".";
import { TooltipProvider } from "@/ui/tooltip";

function renderStudio(mode: "video" | "image" = "video") {
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
    expect(
      screen.getByRole("button", { name: "Generate video" }),
    ).toBeInTheDocument();
  });

  it("opens in image mode", () => {
    renderStudio("image");
    expect(screen.getByText("Image Studio")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate image" }),
    ).toBeInTheDocument();
  });

  it("links to the other studio", () => {
    renderStudio("video");
    const links = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(links).toContain("/create/video");
    expect(links).toContain("/create/image");
  });

  it("prices the generation in dollars", () => {
    renderStudio("video");
    expect(screen.getAllByText(/^\$0\.\d{2}$/).length).toBeGreaterThan(0);
  });

  it("shows the aspect ratio presets", () => {
    renderStudio("video");
    expect(
      screen.getAllByRole("button", { name: /Landscape|Portrait|Square/ })
        .length,
    ).toBeGreaterThan(0);
  });

  it("returns home from its back control", () => {
    renderStudio("video");
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("does not sell credits", () => {
    const { container } = renderStudio("video");
    expect(container.textContent).not.toMatch(/credit/i);
  });
});
