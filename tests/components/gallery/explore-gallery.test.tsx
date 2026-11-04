import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExploreGallery } from "@/components/explore-gallery";

const frames = () => screen.getAllByRole("article");
const counter = () => screen.getByText(/\d+ frames?/);

describe("explore gallery", () => {
  it("renders the whole catalogue with a frame count", () => {
    render(<ExploreGallery />);
    expect(frames().length).toBeGreaterThan(10);
    expect(counter()).toHaveTextContent(/\d+ frames/);
  });

  it("filters by category", async () => {
    render(<ExploreGallery />);
    await userEvent.click(screen.getByRole("button", { name: "City" }));

    expect(counter()).toHaveTextContent(/· City/);
    expect(frames().length).toBeGreaterThan(0);
    expect(frames().length).toBeLessThan(20);
  });

  it("filters by kind", async () => {
    render(<ExploreGallery />);
    await userEvent.click(screen.getByRole("button", { name: "Video" }));

    expect(counter()).toHaveTextContent(/· video/);
    expect(frames().length).toBeGreaterThan(0);
  });

  it("searches titles, prompts and authors", async () => {
    render(<ExploreGallery />);
    await userEvent.type(
      screen.getByPlaceholderText("Search"),
      "Mara Lune",
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

  it("sorts by most liked", async () => {
    render(<ExploreGallery />);
    const before = frames()[0].textContent;

    await userEvent.click(screen.getByRole("button", { name: /Trending/ }));
    const item = await screen.findByRole("menuitem", { name: "Most liked" });
    await userEvent.click(item);

    expect(frames()[0].textContent).not.toBe(before);
    expect(screen.getByRole("button", { name: /Most liked/ })).toBeInTheDocument();
  });
});
