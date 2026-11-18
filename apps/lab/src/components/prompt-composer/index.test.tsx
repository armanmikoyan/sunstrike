import { Provider } from "jotai";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PromptComposer } from ".";
import { TooltipProvider } from "@/ui/tooltip";
import { routerMock } from "~/vitest.setup";

function renderComposer() {
  return render(
    <Provider>
      <TooltipProvider>
        <PromptComposer />
      </TooltipProvider>
    </Provider>,
  );
}

const prompt = () => screen.getByRole("textbox", { name: "Describe your generation" });

describe("home prompt composer", () => {
  it("starts in video mode with a dollar estimate", () => {
    renderComposer();
    expect(prompt()).toBeInTheDocument();
    expect(
      screen.getByText((_, node) => node?.textContent === "$0.51" && node.classList.contains("tabular-nums")),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Video" })).toHaveAttribute("aria-selected", "true");
  });

  it("re-prices when switching to images", async () => {
    renderComposer();
    await userEvent.click(screen.getByRole("tab", { name: "Image" }));
    expect(
      screen.getByText((_, node) => node?.textContent === "$0.07" && node.classList.contains("tabular-nums")),
    ).toBeInTheDocument();
  });

  it("accepts a prompt and starts a generation", async () => {
    renderComposer();
    await userEvent.type(prompt(), "a lighthouse in fog");
    await userEvent.click(screen.getByRole("button", { name: "Start generation" }));

    expect(routerMock.push).toHaveBeenCalledWith("/create/video");
  });

  it("submits on cmd+enter from the textarea", async () => {
    renderComposer();
    await userEvent.type(prompt(), "a lighthouse in fog");
    await userEvent.keyboard("{Meta>}{Enter}{/Meta}");

    expect(routerMock.push).toHaveBeenCalledWith("/create/video");
  });

  it("routes image generations to the image studio", async () => {
    renderComposer();
    await userEvent.click(screen.getByRole("tab", { name: "Image" }));
    await userEvent.type(prompt(), "a soft ceramic form");
    await userEvent.click(screen.getByRole("button", { name: "Start generation" }));

    expect(routerMock.push).toHaveBeenCalledWith("/create/image");
  });

  it("shows an uploaded reference and clears it", async () => {
    const { container } = renderComposer();
    const input = container.querySelector('input[type="file"]');

    expect(input).not.toBeNull();
    fireEvent.change(input as HTMLInputElement, {
      target: {
        files: [new File(["still"], "still.png", { type: "image/png" })],
      },
    });

    expect(screen.getByText("still.png")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Remove attachment" }));

    expect(screen.queryByText("still.png")).not.toBeInTheDocument();
  });

  it("pastes a reference from the attach menu", async () => {
    renderComposer();

    await userEvent.click(screen.getByRole("button", { name: "Attach reference" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Paste from clipboard" }));

    expect(screen.getByText("pasted-reference.png")).toBeInTheDocument();
  });

  it("keeps the estimate in dollars only", () => {
    const { container } = renderComposer();
    expect(container.textContent).not.toMatch(/credit/i);
  });
});
