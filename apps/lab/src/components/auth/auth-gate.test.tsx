import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fetchMock, routerMock, setPathname } from "~/vitest.setup";
import { AuthGate } from "./auth-gate";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("auth gate", () => {
  it("redirects a signed-out visitor and hides the content", async () => {
    setPathname("/settings/account");
    render(
      <AuthGate>
        <p>Account settings</p>
      </AuthGate>,
    );

    expect(screen.queryByText("Account settings")).not.toBeInTheDocument();
    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/login?next=%2Fsettings%2Faccount"));
  });

  it("renders the content for a signed-in visitor", async () => {
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: "arman@wildscape.ai" } }));
    render(
      <AuthGate>
        <p>Account settings</p>
      </AuthGate>,
    );

    expect(await screen.findByText("Account settings")).toBeInTheDocument();
  });
});
