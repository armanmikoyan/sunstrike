import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VideoWithFallback } from ".";

let onIntersect: IntersectionObserverCallback | null = null;
const OriginalObserver = globalThis.IntersectionObserver;

class FakeObserver {
  constructor(callback: IntersectionObserverCallback) {
    onIntersect = callback;
  }
  observe() {}
  disconnect() {}
}

afterEach(() => {
  onIntersect = null;
  globalThis.IntersectionObserver = OriginalObserver;
  vi.restoreAllMocks();
});

describe("video with fallback", () => {
  it("renders a muted, looping, inline player", () => {
    const { container } = render(
      <VideoWithFallback src="/media/01.mp4" poster="/media/01.jpg" fallback="linear-gradient(#000, #111)" />,
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
    const { container } = render(<VideoWithFallback src="/media/missing.mp4" fallback="linear-gradient(#123, #456)" />);

    fireEvent.error(container.querySelector("video")!);

    expect(container.querySelector("video")).toBeNull();
    const fallback = container.firstElementChild as HTMLElement;
    expect(fallback.getAttribute("aria-hidden")).toBe("true");
    expect(fallback.style.backgroundImage).toContain("linear-gradient");
  });

  it("reveals the player once data is loaded", () => {
    const { container } = render(
      <VideoWithFallback src="/media/02.mp4" poster="/media/02.jpg" fallback="linear-gradient(#000, #111)" />,
    );

    const video = container.querySelector("video")!;
    expect(video.className).toContain("opacity-0");

    fireEvent.loadedData(video);
    expect(video.className).toContain("opacity-100");
  });
});

describe("video playback", () => {
  it("does not start playback until the observer reports the clip in view", () => {
    globalThis.IntersectionObserver = FakeObserver as never;
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});

    const { container } = render(
      <VideoWithFallback src="/media/01.mp4" poster="/media/01.jpg" fallback="linear-gradient(#000, #111)" />,
    );

    fireEvent.loadedData(container.querySelector("video")!);
    expect(play).not.toHaveBeenCalled();

    act(() => {
      onIntersect?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(play).toHaveBeenCalled();
  });

  it("plays only while the clip is on screen", () => {
    globalThis.IntersectionObserver = FakeObserver as never;
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});

    const { container } = render(
      <VideoWithFallback src="/media/01.mp4" poster="/media/01.jpg" fallback="linear-gradient(#000, #111)" />,
    );

    fireEvent.loadedData(container.querySelector("video")!);

    act(() => {
      onIntersect?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(pause).toHaveBeenCalled();

    act(() => {
      onIntersect?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(play).toHaveBeenCalled();
  });

  it("never seeks, so repeated clips keep sharing one download", () => {
    const seek = vi.fn();
    const original = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "currentTime");
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      configurable: true,
      get: () => 0,
      set: seek,
    });

    try {
      const { container } = render(
        <>
          <VideoWithFallback src="/media/01.mp4" fallback="linear-gradient(#000, #111)" />
          <VideoWithFallback src="/media/01.mp4" fallback="linear-gradient(#000, #111)" />
        </>,
      );

      for (const video of container.querySelectorAll("video")) fireEvent.loadedData(video);

      expect(seek).not.toHaveBeenCalled();
    } finally {
      if (original) Object.defineProperty(HTMLMediaElement.prototype, "currentTime", original);
    }
  });
});
