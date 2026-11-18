import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq } from ".";
import type { FaqItem } from "./types";

const items: FaqItem[] = [
  { question: "First?", answer: "One" },
  { question: "Second?", answer: "Two" },
  { question: "Third?", answer: "Three" },
];

describe("faq", () => {
  it("keeps one answer open in a single column", async () => {
    render(<Faq items={items} />);

    await userEvent.click(screen.getByRole("button", { name: "First?" }));
    await userEvent.click(screen.getByRole("button", { name: "Second?" }));

    expect(screen.getByRole("button", { name: "First?" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Second?" })).toHaveAttribute("aria-expanded", "true");
  });

  it("splits the items across two columns by their original order", () => {
    const { container } = render(<Faq items={items} columns={2} />);
    const ordered = [...container.querySelectorAll("[style]")].map((node) => (node as HTMLElement).style.order);

    expect(ordered).toEqual(["0", "2", "1"]);
  });
});
