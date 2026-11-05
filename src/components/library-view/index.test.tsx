import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LibraryView } from ".";
import { mediaItems } from "@/lib/media";

const libraryCount = 14;
const cards = () => screen.getAllByRole("article");

describe("library view", () => {
  it("shows the recent work by default", () => {
    render(<LibraryView />);
    expect(cards()).toHaveLength(libraryCount);
    expect(screen.getByText(mediaItems[0].title)).toBeInTheDocument();
  });

  it("filters to videos", async () => {
    render(<LibraryView />);
    await userEvent.click(screen.getByRole("tab", { name: "Video" }));
    const visible = cards();
    expect(visible.length).toBeLessThan(libraryCount);
    expect(
      screen.queryByText(/^Image$/, { selector: "span" }),
    ).not.toBeInTheDocument();
  });

  it("filters to images", async () => {
    render(<LibraryView />);
    await userEvent.click(screen.getByRole("tab", { name: "Images" }));
    expect(cards().length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: "Images" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("narrows by search text", async () => {
    render(<LibraryView />);
    const search = screen.getByPlaceholderText("Search your library");
    await userEvent.type(search, mediaItems[0].title.slice(0, 5));

    expect(cards().length).toBeLessThan(libraryCount);
    expect(cards().length).toBeGreaterThan(0);
  });

  it("shows an empty state when nothing matches", async () => {
    render(<LibraryView />);
    await userEvent.type(
      screen.getByPlaceholderText("Search your library"),
      "zzzzzz-no-match",
    );

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
    expect(
      screen.getByText("Generate a frame or clear your search."),
    ).toBeInTheDocument();
  });
});
