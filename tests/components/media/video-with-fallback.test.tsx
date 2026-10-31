import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoWithFallback } from "@/components/media/video-with-fallback";

describe("video with fallback", () => {
  it("renders a muted, looping, inline player", () => {
    const { container } = render(
      <VideoWithFallback
        src="/media/01.mp4"
        poster="/media/01.jpg"
        fallback="linear-gradient(#000, #111)"
      />,
    );

    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("src", "/media/01.mp4");
    expect(video).toHaveAttribute("poster", "/media/01.jpg");
    expect(video?.muted).toBe(true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
  });

  it("swaps to the gradient when the clip fails", () => {
    const { container } = render(
      <VideoWithFallback
        src="/media/missing.mp4"
        fallback="linear-gradient(#123, #456)"
      />,
    );

    fireEvent.error(container.querySelector("video")!);

    expect(container.querySelector("video")).toBeNull();
    const fallback = container.firstElementChild as HTMLElement;
    expect(fallback.getAttribute("aria-hidden")).toBe("true");
    expect(fallback.style.backgroundImage).toContain("linear-gradient");
  });

  it("reveals the player once data is loaded", () => {
    const { container } = render(
      <VideoWithFallback
        src="/media/02.mp4"
        poster="/media/02.jpg"
        fallback="linear-gradient(#000, #111)"
      />,
    );

    const video = container.querySelector("video")!;
    expect(video.className).toContain("opacity-0");

    fireEvent.loadedData(video);
    expect(video.className).toContain("opacity-100");
  });
});
