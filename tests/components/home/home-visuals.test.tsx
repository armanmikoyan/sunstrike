import { Provider } from "jotai";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RatioMosaic } from "@/components/home/ratio-mosaic";
import { VideoWall } from "@/components/home/video-wall";
import { PromptSuggestions } from "@/components/home/prompt-suggestions";
import { promptAtom, modeAtom } from "@/lib/store";
import { useAtomValue } from "jotai";

function Probe() {
  const prompt = useAtomValue(promptAtom);
  const mode = useAtomValue(modeAtom);
  return (
    <output data-testid="probe">
      {mode}:{prompt}
    </output>
  );
}

describe("video wall", () => {
  it("renders the looping columns of clips", () => {
    const { container } = render(<VideoWall />);
    expect(container.querySelectorAll("video").length).toBeGreaterThan(12);
  });
});

describe("ratio mosaic", () => {
  it("names the shapes it shows", () => {
    render(<RatioMosaic />);
    expect(
      screen.getByRole("heading", { level: 2 }),
    ).toBeInTheDocument();
    for (const ratio of ["9:16", "3:4", "1:1"]) {
      expect(screen.getAllByText(ratio).length).toBeGreaterThan(0);
    }
  });
});

describe("prompt suggestions", () => {
  it("fills the prompt and the mode", async () => {
    render(
      <Provider>
        <PromptSuggestions />
        <Probe />
      </Provider>,
    );

    const suggestions = screen.getAllByRole("button");
    expect(suggestions.length).toBeGreaterThanOrEqual(4);

    const worldbuilding = screen.getByRole("button", { name: /Worldbuilding/ });
    await userEvent.click(worldbuilding);

    const probe = screen.getByTestId("probe").textContent ?? "";
    expect(probe.startsWith("image:")).toBe(true);
    expect(probe).toContain("ancient coastal city");
  });

  it("uses a video model for cinematic suggestions", async () => {
    render(
      <Provider>
        <PromptSuggestions />
        <Probe />
      </Provider>,
    );

    await userEvent.click(screen.getByRole("button", { name: /Cinematic/ }));
    expect(screen.getByTestId("probe").textContent).toContain("video:A cinematic");
  });

  it("keeps its labels short and sentence case", () => {
    render(
      <Provider>
        <PromptSuggestions />
      </Provider>,
    );
    const labels = screen
      .getAllByRole("button")
      .map((button) => within(button).getByText(/.+/).textContent ?? "");

    for (const label of labels) {
      expect(label.length).toBeLessThan(30);
    }
  });
});
