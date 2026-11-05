import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from ".";

describe("section header", () => {
  it("renders a level two heading with its description", () => {
    render(<SectionHeader title="Recent work" description="Newest first." />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Recent work" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Newest first.")).toBeInTheDocument();
  });
});
