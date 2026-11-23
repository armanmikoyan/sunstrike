import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CodeInput } from "./code-input";

function Harness() {
  const [value, setValue] = useState("");

  return (
    <>
      <span id="code-label">Code</span>
      <CodeInput value={value} onChange={setValue} labelledBy="code-label" />
    </>
  );
}

function boxes(): HTMLInputElement[] {
  return screen.getAllByRole("textbox") as HTMLInputElement[];
}

function digits(): string[] {
  return boxes().map((box) => box.value);
}

describe("code input", () => {
  it("renders six boxes under one label", () => {
    render(<Harness />);

    expect(screen.getByRole("group", { name: "Code" })).toBeInTheDocument();
    expect(boxes()).toHaveLength(6);
    expect(digits()).toEqual(["", "", "", "", "", ""]);
  });

  it("types forward one digit per box", async () => {
    render(<Harness />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("1234");

    expect(digits()).toEqual(["1", "2", "3", "4", "", ""]);
    expect(boxes()[4]).toHaveFocus();
  });

  it("ignores non-digits", async () => {
    render(<Harness />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("a1b");

    expect(digits()).toEqual(["1", "", "", "", "", ""]);
  });

  it("backspaces through the code one box at a time", async () => {
    render(<Harness />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("123");
    await userEvent.keyboard("{Backspace}");

    expect(digits()).toEqual(["1", "2", "", "", "", ""]);
    expect(boxes()[2]).toHaveFocus();

    await userEvent.keyboard("{Backspace}");

    expect(digits()).toEqual(["1", "", "", "", "", ""]);
    expect(boxes()[1]).toHaveFocus();
  });

  it("clears the digit under the cursor when backspacing a filled box", async () => {
    render(<Harness />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("123");
    await userEvent.click(boxes()[1]);
    await userEvent.keyboard("{Backspace}");

    expect(digits()).toEqual(["1", "3", "", "", "", ""]);
    expect(boxes()[1]).toHaveFocus();
  });

  it("fills every box from a pasted code", async () => {
    render(<Harness />);

    await userEvent.click(boxes()[0]);
    await userEvent.paste("123 456");

    expect(digits()).toEqual(["1", "2", "3", "4", "5", "6"]);
    expect(boxes()[5]).toHaveFocus();
  });

  it("moves with the arrow keys without changing the code", async () => {
    render(<Harness />);

    await userEvent.click(boxes()[0]);
    await userEvent.keyboard("12");
    await userEvent.keyboard("{ArrowLeft}");

    expect(boxes()[1]).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}{ArrowRight}");

    expect(boxes()[3]).toHaveFocus();
    expect(digits()).toEqual(["1", "2", "", "", "", ""]);
  });

  it("disables every box while the request is pending", () => {
    render(
      <>
        <span id="code-label">Code</span>
        <CodeInput value="12" onChange={() => {}} labelledBy="code-label" disabled />
      </>,
    );

    expect(boxes().every((box) => box.disabled)).toBe(true);
  });
});
