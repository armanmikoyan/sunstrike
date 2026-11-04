import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaCard } from "@/components/media-card";
import { mediaById, type MediaItem } from "@/lib/media";

const video = mediaById("01") as MediaItem;
const still = mediaById("05") as MediaItem;

describe("media card", () => {
  it("shows the title, author and like count", () => {
    render(<MediaCard item={video} />);
    expect(screen.getByText(video.title)).toBeInTheDocument();
    expect(screen.getByText(video.author)).toBeInTheDocument();
    expect(screen.getByText(video.likes.toLocaleString("en-US"))).toBeInTheDocument();
  });

  it("marks videos with a duration", () => {
    render(<MediaCard item={video} />);
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText(video.duration as string)).toBeInTheDocument();
  });

  it("marks stills without a duration", () => {
    render(<MediaCard item={still} />);
    expect(screen.getByText("Image")).toBeInTheDocument();
  });

  it("offers a remix link that matches the media kind", () => {
    render(<MediaCard item={video} />);
    expect(screen.getByRole("link", { name: /Remix/ })).toHaveAttribute(
      "href",
      "/create/video",
    );
  });

  it("links to explore for details", () => {
    render(<MediaCard item={video} />);
    expect(screen.getByRole("link", { name: /Details/ })).toHaveAttribute(
      "href",
      "/explore",
    );
  });

  it("exposes an accessible save control", () => {
    render(<MediaCard item={video} />);
    expect(
      screen.getByRole("button", { name: `Save ${video.title}` }),
    ).toBeInTheDocument();
  });

  it("can hide the meta block", () => {
    render(<MediaCard item={video} showMeta={false} />);
    expect(screen.queryByText(video.title)).not.toBeInTheDocument();
  });
});
