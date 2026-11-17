import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CookieConsent } from ".";
import { consentEvent, consentStorageKey } from "./constants";
import { readConsent, useCookieConsent } from "./hooks";

describe("cookie consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("asks once on a first visit", async () => {
    render(<CookieConsent />);

    expect(
      await screen.findByRole("region", { name: "Cookie consent" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Privacy policy" }),
    ).toHaveAttribute("href", "/privacy#cookies");
    expect(
      screen.getByRole("button", { name: "Accept all" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Essential only" }),
    ).toBeInTheDocument();
  });

  it("saves Accept all and tells the rest of the app", async () => {
    const listener = vi.fn();
    window.addEventListener(consentEvent, listener);
    render(<CookieConsent />);

    fireEvent.click(await screen.findByRole("button", { name: "Accept all" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("region", { name: "Cookie consent" }),
      ).not.toBeInTheDocument(),
    );
    expect(window.localStorage.getItem(consentStorageKey)).toBe("all");
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(consentEvent, listener);
  });

  it("stores Essential only without starting analytics", async () => {
    render(<CookieConsent />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Essential only" }),
    );

    await waitFor(() => expect(readConsent()).toBe("essential"));
    expect(
      screen.queryByRole("region", { name: "Cookie consent" }),
    ).not.toBeInTheDocument();
  });

  it("stays closed when a choice is already stored", async () => {
    window.localStorage.setItem(consentStorageKey, "all");
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.open).toBe(false);
    expect(result.current.choice).toBe("all");
  });

  it("ignores unknown values and blocked storage", () => {
    window.localStorage.setItem(consentStorageKey, "sometimes");
    expect(readConsent()).toBeNull();

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readConsent()).toBeNull();
  });
});
