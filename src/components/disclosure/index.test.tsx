import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Disclosure } from ".";

describe("disclosure", () => {
  it("starts collapsed and opens on click", async () => {
    render(<Disclosure question="Is there a subscription?" answer="No." />);

    const trigger = screen.getByRole("button", {
      name: "Is there a subscription?",
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("toggles closed again", async () => {
    render(<Disclosure question="Is there a subscription?" answer="No." />);

    const trigger = screen.getByRole("button", {
      name: "Is there a subscription?",
    });
    await userEvent.click(trigger);
    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
