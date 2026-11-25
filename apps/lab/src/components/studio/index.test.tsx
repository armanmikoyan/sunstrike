import { Provider } from "jotai";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Studio } from ".";
import type { GenerationMode } from "./types";
import { TooltipProvider } from "@/ui/tooltip";
import { fetchMock } from "~/vitest.setup";

async function renderStudio(mode: GenerationMode = "video") {
  const view = render(
    <Provider>
      <TooltipProvider>
        <Studio initialMode={mode} />
      </TooltipProvider>
    </Provider>,
  );

  await screen.findByRole("button", { name: mode === "video" ? "Generate video" : "Generate image" });

  return view;
}

const priced = (amount: string) => (_: string, node: Element | null) =>
  node?.textContent === amount && Boolean(node?.classList.contains("tabular-nums"));

describe("studio", () => {
  it("opens in video mode", async () => {
    await renderStudio("video");
    expect(screen.getByText("Video Studio")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate video" })).toBeInTheDocument();
  });

  it("opens in image mode", async () => {
    await renderStudio("image");
    expect(screen.getByText("Image Studio")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate image" })).toBeInTheDocument();
  });

  it("links to the other studio", async () => {
    await renderStudio("video");
    const links = screen.getAllByRole("link").map((link) => link.getAttribute("href"));

    expect(links).toContain("/create/video");
    expect(links).toContain("/create/image");
  });

  it("prices the generation from the engine quote", async () => {
    await renderStudio("video");
    expect((await screen.findAllByText(priced("$0.43"))).length).toBeGreaterThan(0);
  });

  it("lists the engine's models with their rates", async () => {
    await renderStudio("video");

    await userEvent.click(screen.getByRole("button", { name: "Chronolab Motion 2" }));

    expect(screen.getByRole("menuitemradio", { name: /Seedance/ })).toHaveTextContent("$0.09/s");
    expect(screen.queryByRole("menuitemradio", { name: /Chronolab Image 2/ })).not.toBeInTheDocument();
  });

  it("re-quotes when the model changes", async () => {
    await renderStudio("video");

    await userEvent.click(screen.getByRole("button", { name: "Chronolab Motion 2" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /Seedance/ }));

    expect((await screen.findAllByText(priced("$0.45"))).length).toBeGreaterThan(0);
  });

  it("says so when the models cannot load", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }));
    render(
      <Provider>
        <TooltipProvider>
          <Studio initialMode="video" />
        </TooltipProvider>
      </Provider>,
    );

    expect(await screen.findByText("Models are unavailable")).toBeInTheDocument();
    expect(screen.getByText("Video Studio")).toBeInTheDocument();
  });

  it("shows the aspect ratio presets", async () => {
    await renderStudio("video");
    expect(screen.getAllByRole("button", { name: /Landscape|Portrait|Square/ }).length).toBeGreaterThan(0);
  });

  it("attaches a reference file", async () => {
    const { container } = await renderStudio("video");
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
    await renderStudio("video");

    await userEvent.click(screen.getByRole("button", { name: "No template" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /Product turntable/ }));

    expect(screen.getByRole("button", { name: "Product turntable" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Product turntable" }));
    await userEvent.click(screen.getByRole("menuitemradio", { name: /No template/ }));

    expect(screen.getByRole("button", { name: "No template" })).toBeInTheDocument();
  });

  it("returns home from its back control", async () => {
    await renderStudio("video");
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
  });

  it("does not sell credits", async () => {
    const { container } = await renderStudio("video");
    expect(container.textContent).not.toMatch(/credit/i);
  });
});
