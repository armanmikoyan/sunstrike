import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AUTH_COPY, SIGN_OUT_MIN_MS, SIGNED_OUT_EVENT, SIGNING_OUT_EVENT } from "./constants";
import { SignOutOverlay } from "./sign-out-overlay";

describe("sign-out overlay", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows while signing out and keeps the modal up for a minimum time", () => {
    vi.useFakeTimers();
    render(<SignOutOverlay />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => window.dispatchEvent(new Event(SIGNING_OUT_EVENT)));

    expect(screen.getByRole("dialog", { name: AUTH_COPY.signingOut })).toBeInTheDocument();
    expect(screen.getByText(AUTH_COPY.signingOut)).toBeInTheDocument();
    expect(screen.getByText(AUTH_COPY.signingOutDetail)).toBeInTheDocument();

    act(() => window.dispatchEvent(new Event(SIGNED_OUT_EVENT)));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(SIGN_OUT_MIN_MS));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hides at once when the minimum time has already elapsed", () => {
    vi.useFakeTimers();
    render(<SignOutOverlay />);

    act(() => window.dispatchEvent(new Event(SIGNING_OUT_EVENT)));
    act(() => vi.advanceTimersByTime(SIGN_OUT_MIN_MS));
    act(() => window.dispatchEvent(new Event(SIGNED_OUT_EVENT)));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
