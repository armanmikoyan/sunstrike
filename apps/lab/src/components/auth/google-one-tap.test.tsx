import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMock, setPathname } from "~/vitest.setup";
import { GoogleOneTap } from "./google-one-tap";
import type { GoogleWindow } from "./types";
import { navigate, reloadPage } from "./utils";

vi.mock("./utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./utils")>();
  return { ...actual, navigate: vi.fn(), reloadPage: vi.fn() };
});

vi.mock("next/script", () => ({
  default: ({ onReady }: { onReady?: () => void }) => (
    <button type="button" onClick={onReady}>
      Load Google
    </button>
  ),
}));

const initialize = vi.fn();
const prompt = vi.fn();
const cancel = vi.fn();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function start() {
  render(<GoogleOneTap />);
  await userEvent.click(await screen.findByRole("button", { name: "Load Google" }));
  await waitFor(() => expect(initialize).toHaveBeenCalled());

  return initialize.mock.calls[0]?.[0] as {
    callback: (response: { credential?: string }) => Promise<void>;
  };
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "client-id");
  Object.defineProperty(window, "google", {
    value: { accounts: { id: { initialize, prompt, cancel } } },
    configurable: true,
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete (window as GoogleWindow).google;
  initialize.mockReset();
  prompt.mockReset();
  cancel.mockReset();
  vi.mocked(navigate).mockReset();
  window.history.replaceState(null, "", "/");
});

describe("GoogleOneTap", () => {
  it("prompts Google when the script is ready", async () => {
    await start();

    expect(initialize).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: "client-id", nonce: expect.any(String) }),
    );
    expect(prompt).toHaveBeenCalled();
  });

  it("exchanges the credential and reloads", async () => {
    const options = await start();
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));

    await act(async () => {
      await options.callback({ credential: "credential" });
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/google", expect.objectContaining({ method: "POST" }));

    const calls = fetchMock.mock.calls as unknown as [string, RequestInit][];
    const call = calls.find(([url]) => url === "/api/auth/google");
    expect(JSON.parse(String(call?.[1].body))).toEqual({ credential: "credential", nonce: expect.any(String) });
    expect(reloadPage).toHaveBeenCalled();
  });

  it("returns to the requested page after signing in on login", async () => {
    setPathname("/login");
    window.history.replaceState(null, "", "/login?next=%2Fsettings%2Faccount");
    const options = await start();
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));

    await act(async () => {
      await options.callback({ credential: "credential" });
    });

    expect(navigate).toHaveBeenCalledWith("/settings/account");
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it("ignores empty credentials and failed exchanges", async () => {
    const options = await start();

    await options.callback({});
    expect(fetchMock).not.toHaveBeenCalledWith("/api/auth/google", expect.anything());

    fetchMock.mockResolvedValueOnce(json({ error: "Nope" }, 500));
    await options.callback({ credential: "credential" });
    expect(reloadPage).not.toHaveBeenCalled();

    fetchMock.mockRejectedValueOnce(new Error("offline"));
    await options.callback({ credential: "credential" });
    expect(reloadPage).not.toHaveBeenCalled();
  });

  it("prompts on the login page", async () => {
    setPathname("/login");
    render(<GoogleOneTap />);

    await userEvent.click(await screen.findByRole("button", { name: "Load Google" }));

    await waitFor(() => expect(initialize).toHaveBeenCalled());
    expect(prompt).toHaveBeenCalled();
  });

  it("cancels One Tap when signed in", async () => {
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: null } }));

    render(<GoogleOneTap />);

    await waitFor(() => expect(cancel).toHaveBeenCalled());
    expect(screen.queryByRole("button", { name: "Load Google" })).not.toBeInTheDocument();
  });

  it("does not prompt without a secure context", async () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "isSecureContext");
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: false });

    try {
      render(<GoogleOneTap />);
      await userEvent.click(await screen.findByRole("button", { name: "Load Google" }));

      expect(initialize).not.toHaveBeenCalled();
      expect(prompt).not.toHaveBeenCalled();
    } finally {
      if (descriptor) Object.defineProperty(window, "isSecureContext", descriptor);
      else Reflect.deleteProperty(window, "isSecureContext");
    }
  });

  it("renders nothing without a client id", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "");

    const { container } = render(<GoogleOneTap />);

    expect(container).toBeEmptyDOMElement();
  });
});
