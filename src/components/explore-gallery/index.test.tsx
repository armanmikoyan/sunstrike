import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExploreGallery } from ".";

const frames = () => screen.getAllByRole("article");
const counter = () => screen.getByText(/\d+ frames?/);

describe("explore gallery", () => {
  it("renders the whole catalogue with a frame count", () => {
    render(<ExploreGallery />);
    expect(frames().length).toBeGreaterThan(10);
    expect(counter()).toHaveTextContent(/\d+ frames/);
  });

  it("filters by kind", async () => {
    render(<ExploreGallery />);
    await userEvent.click(screen.getByRole("button", { name: "Video" }));

    expect(counter()).toHaveTextContent(/· video/);
    expect(frames().length).toBeGreaterThan(0);
  });

  it("searches titles, prompts and models", async () => {
    render(<ExploreGallery />);
    await userEvent.type(
      screen.getByPlaceholderText("Search"),
      "Chronolab Motion",
    );

    expect(frames().length).toBeGreaterThan(0);
    expect(frames().length).toBeLessThan(20);
  });

  it("shows an empty state when the filters exclude everything", async () => {
    render(<ExploreGallery />);
    await userEvent.type(
      screen.getByPlaceholderText("Search"),
      "nothing-matches-this",
    );

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText("No frames found")).toBeInTheDocument();
  });
});
