import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fetchMock, routerMock, setPathname } from "~/vitest.setup";
import { useRequireAuth, useSessionUser, useSignOut } from "./hooks";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const user = { id: "user-1", email: "arman@chronolab.ai" };

describe("useSessionUser", () => {
  it("loads the current user", async () => {
    fetchMock.mockResolvedValueOnce(json({ user }));
    const { result } = renderHook(() => useSessionUser());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.user).toEqual(user));
    expect(result.current.loading).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/session", expect.objectContaining({ cache: "no-store" }));
  });

  it("settles on no user for an unauthorized response", async () => {
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
});

describe("useSignOut", () => {
  it("clears the session through the BFF and returns to login", async () => {
    const { result } = renderHook(() => useSignOut());

    await act(async () => {
      await result.current.signOut();
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/sign-out", { method: "POST" });
    expect(routerMock.replace).toHaveBeenCalledWith("/login");
    expect(routerMock.refresh).toHaveBeenCalled();
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
