import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MediaResync } from ".";
import { RESYNC_DELAY_MS } from "./constants";
import { setPathname } from "~/vitest.setup";

describe("media resync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    setPathname("/");
  });

  it("pauses every player on a route commit", () => {
    const video = document.createElement("video");
    document.body.appendChild(video);
    const pause = vi.spyOn(video, "pause");

    render(<MediaResync />);

    expect(pause).toHaveBeenCalled();
    video.remove();
  });

  it("re-notifies players once the new route has laid out", () => {
    const listener = vi.fn();
    window.addEventListener("wildscape:media-resync", listener);

    render(<MediaResync />);
    expect(listener).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(RESYNC_DELAY_MS);
    });
    expect(listener).toHaveBeenCalled();

    window.removeEventListener("wildscape:media-resync", listener);
  });
});
