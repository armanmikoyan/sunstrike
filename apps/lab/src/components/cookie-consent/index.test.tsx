import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CookieConsent } from ".";
import { CONSENT_EVENT, CONSENT_STORAGE_KEY } from "./constants";
import { useCookieConsent } from "./hooks";
import { readConsent } from "./utils";

describe("cookie consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("asks once on a first visit", async () => {
    render(<CookieConsent />);

    expect(await screen.findByRole("region", { name: "Cookie consent" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/privacy#cookies");
    expect(screen.getByRole("button", { name: "Accept all" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Essential only" })).toBeInTheDocument();
  });

  it("plays the exit animation before it saves the choice", async () => {
    render(<CookieConsent />);

    fireEvent.click(await screen.findByRole("button", { name: "Accept all" }));

    const banner = screen.getByRole("region", { name: "Cookie consent" });
    expect(banner.className).toContain("animate-out");
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });

    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("all");
  });

  it("saves at once when motion is reduced", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<CookieConsent />);

    fireEvent.click(await screen.findByRole("button", { name: "Essential only" }));

    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("essential");
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
  });

  it("saves Accept all and tells the rest of the app", async () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);
    render(<CookieConsent />);

    fireEvent.click(await screen.findByRole("button", { name: "Accept all" }));

    await waitFor(() => expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument());
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("all");
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(CONSENT_EVENT, listener);
  });

  it("stores Essential only without starting analytics", async () => {
    render(<CookieConsent />);

    fireEvent.click(await screen.findByRole("button", { name: "Essential only" }));

    await waitFor(() => expect(readConsent()).toBe("essential"));
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
  });

  it("stays closed when a choice is already stored", async () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "all");
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.open).toBe(false);
    expect(result.current.choice).toBe("all");
  });

  it("ignores unknown values and blocked storage", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "sometimes");
    expect(readConsent()).toBeNull();

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readConsent()).toBeNull();
  });
});
