import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fetchMock, routerMock, setPathname } from "~/vitest.setup";
import { SIGNED_IN_EVENT } from "./constants";
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

  it("revalidates for a later mount instead of caching the user", async () => {
    fetchMock.mockImplementation(async () => json({ user }));
    const first = renderHook(() => useSessionUser());

    await waitFor(() => expect(first.result.current.user).toEqual(user));
    first.unmount();

    const second = renderHook(() => useSessionUser());

    await waitFor(() => expect(second.result.current.user).toEqual(user));
    expect(fetchMock).toHaveBeenCalledTimes(2);
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
  it("clears the session through the BFF and stays on a public page", async () => {
    setPathname("/library");
    const { result } = renderHook(() => useSignOut());

    await act(async () => {
      await result.current.signOut();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-out", { method: "POST" });
    expect(routerMock.replace).not.toHaveBeenCalled();
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
