import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VideoWall } from ".";
import { WALL_IDLE_FALLBACK_MS } from "./constants";

describe("video wall", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("repeats every column for a seamless loop", () => {
    const { container } = render(<VideoWall />);

    expect(container.querySelectorAll("[data-wall-tile]")).toHaveLength(30);
  });

  it("paints posters before mounting any clip", () => {
    const { container } = render(<VideoWall />);

    expect(container.querySelectorAll("video")).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(WALL_IDLE_FALLBACK_MS);
    });

    expect(container.querySelectorAll("video, img")).toHaveLength(30);
  });

  it("preloads only the single leading clip", () => {
    const { container } = render(<VideoWall />);

    act(() => {
      vi.advanceTimersByTime(WALL_IDLE_FALLBACK_MS);
    });

    const videos = container.querySelectorAll("video");
    expect(videos[0]).toHaveAttribute("preload", "auto");
    expect(videos[1]).toHaveAttribute("preload", "none");
  });

  it("streams the full-resolution wall encode", () => {
    const { container } = render(<VideoWall />);

    act(() => {
      vi.advanceTimersByTime(WALL_IDLE_FALLBACK_MS);
    });

    const videos = [...container.querySelectorAll("video")];
    expect(videos).not.toHaveLength(0);
    for (const video of videos) {
      expect(video.getAttribute("src")).toMatch(/^\/videos\/[^/]+\/preview-wall\.mp4$/);
    }
  });
});
