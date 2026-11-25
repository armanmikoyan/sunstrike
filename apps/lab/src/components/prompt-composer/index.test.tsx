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
  it("starts in video mode on the first video model, without a price", async () => {
    renderComposer();
    expect(prompt()).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Chronolab Motion 2" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Video" })).toHaveAttribute("aria-selected", "true");
    expect(screen.queryByText("Estimated")).not.toBeInTheDocument();
  });

  it("switches to the first image model", async () => {
    renderComposer();
    await userEvent.click(screen.getByRole("tab", { name: "Image" }));
    expect(await screen.findByRole("button", { name: "Chronolab Image 2" })).toBeInTheDocument();
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
