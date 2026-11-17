import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from ".";

describe("page header", () => {
  it("renders a level one heading with optional context", () => {
    render(
      <PageHeader
        eyebrow="Your studio"
        title="Library"
        description="Everything you have made."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Library" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your studio")).toBeInTheDocument();
    expect(screen.getByText("Everything you have made.")).toBeInTheDocument();
  });

  it("renders an action slot", () => {
    render(<PageHeader title="Assets" action={<button>Upload</button>} />);
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });
});
