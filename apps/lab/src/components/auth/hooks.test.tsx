import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchMock, routerMock, setPathname } from "~/vitest.setup";
import { NAVIGATION_SETTLED_EVENT, NAVIGATION_START_EVENT } from "@/components/navigation-progress/constants";
import { SESSION_FRESH_MS, SIGNED_IN_EVENT, SIGN_OUT_MIN_MS } from "./constants";
import { useLoginHref, useRequireAuth, useSessionUser, useSignOut } from "./hooks";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const user = { id: "user-1", email: "arman@wildscape.ai" };

describe("useSessionUser", () => {
  it("loads the current user", async () => {
    fetchMock.mockResolvedValueOnce(json({ user }));
    const { result } = renderHook(() => useSessionUser());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.user).toEqual(user));
    expect(result.current.loading).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/session", expect.objectContaining({ cache: "no-store" }));
  });

  it("settles on no user for a signed-out response", async () => {
    const { result } = renderHook(() => useSessionUser());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("settles on no user for an error response", async () => {
    fetchMock.mockResolvedValueOnce(json({ error: "Nope" }, 500));
    const { result } = renderHook(() => useSessionUser());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("settles on no user when the request fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() => useSessionUser());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("shares one request between components that mount together", async () => {
    fetchMock.mockResolvedValueOnce(json({ user }));
    const first = renderHook(() => useSessionUser());
    const second = renderHook(() => useSessionUser());

    await waitFor(() => {
      expect(first.result.current.user).toEqual(user);
      expect(second.result.current.user).toEqual(user);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reuses a fresh session for a later mount without another request", async () => {
    fetchMock.mockImplementation(async () => json({ user }));
    const first = renderHook(() => useSessionUser());

    await waitFor(() => expect(first.result.current.user).toEqual(user));
    first.unmount();

    const second = renderHook(() => useSessionUser());

    expect(second.result.current).toEqual({ user, loading: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("revalidates for a later mount once the session check is stale", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_000);
    fetchMock.mockImplementation(async () => json({ user }));
    const first = renderHook(() => useSessionUser());

    await waitFor(() => expect(first.result.current.user).toEqual(user));
    first.unmount();
    now.mockReturnValue(1_000 + SESSION_FRESH_MS);

    const second = renderHook(() => useSessionUser());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(second.result.current.user).toEqual(user);
    now.mockRestore();
  });

  it("retries a failed check on the next mount", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    const first = renderHook(() => useSessionUser());

    await waitFor(() => expect(first.result.current.loading).toBe(false));
    first.unmount();
    fetchMock.mockResolvedValueOnce(json({ user }));

    const second = renderHook(() => useSessionUser());

    await waitFor(() => expect(second.result.current.user).toEqual(user));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("applies a sign-in that happened while nothing was mounted", async () => {
    const first = renderHook(() => useSessionUser());

    await waitFor(() => expect(first.result.current.loading).toBe(false));
    first.unmount();
    fetchMock.mockResolvedValueOnce(json({ user }));

    act(() => window.dispatchEvent(new Event(SIGNED_IN_EVENT)));
    const second = renderHook(() => useSessionUser());

    await waitFor(() => expect(second.result.current.user).toEqual(user));
  });

  it("revalidates when another sign-in flow completes", async () => {
    const { result } = renderHook(() => useSessionUser());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();

    fetchMock.mockResolvedValueOnce(json({ user }));

    act(() => window.dispatchEvent(new Event(SIGNED_IN_EVENT)));

    await waitFor(() => expect(result.current.user).toEqual(user));
  });
});

describe("useSignOut", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("clears the session through the BFF and stays on a public page", async () => {
    setPathname("/library");
    const { result } = renderHook(() => useSignOut());

    await act(async () => {
      await result.current.signOut();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-out", { method: "POST" });
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  it("drives the navigation bar and holds it for a moment before settling", async () => {
    vi.useFakeTimers();
    setPathname("/library");
    const events: string[] = [];
    const record = (event: Event) => events.push(event.type);
    window.addEventListener(NAVIGATION_START_EVENT, record);
    window.addEventListener(NAVIGATION_SETTLED_EVENT, record);

    const { result } = renderHook(() => useSignOut());

    await act(async () => {
      await result.current.signOut();
    });

    expect(events).toEqual([NAVIGATION_START_EVENT]);

    act(() => vi.advanceTimersByTime(SIGN_OUT_MIN_MS - 1));
    expect(events).toEqual([NAVIGATION_START_EVENT]);

    act(() => vi.advanceTimersByTime(1));
    expect(events).toEqual([NAVIGATION_START_EVENT, NAVIGATION_SETTLED_EVENT]);

    window.removeEventListener(NAVIGATION_START_EVENT, record);
    window.removeEventListener(NAVIGATION_SETTLED_EVENT, record);
    vi.useRealTimers();
  });

  it("lets a protected route's auth gate go home instead of login", async () => {
    fetchMock.mockResolvedValueOnce(json({ user }));
    setPathname("/settings/account");
    const { result } = renderHook(() => ({
      auth: useRequireAuth(),
      signOut: useSignOut(),
    }));

    await waitFor(() => expect(result.current.auth.user).toEqual(user));

    await act(async () => {
      await result.current.signOut.signOut();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-out", { method: "POST" });
    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/"));
  });
});

describe("useLoginHref", () => {
  it("keeps the current page for the return trip", () => {
    setPathname("/library");
    const { result } = renderHook(() => useLoginHref());

    expect(result.current).toBe("/login?next=%2Flibrary");
  });
});

describe("useRequireAuth", () => {
  it("redirects a signed-out visitor to login", async () => {
    setPathname("/settings/account");
    const { result } = renderHook(() => useRequireAuth());

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/login?next=%2Fsettings%2Faccount"));
    expect(result.current.user).toBeNull();
  });

  it("keeps a signed-in visitor in place", async () => {
    fetchMock.mockResolvedValueOnce(json({ user }));
    setPathname("/settings/account");
    const { result } = renderHook(() => useRequireAuth());

    await waitFor(() => expect(result.current.user).toEqual(user));
    expect(routerMock.replace).not.toHaveBeenCalled();
  });
});
