import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMock } from "~/vitest.setup";
import { GoogleOneTap } from "./google-one-tap";
import type { GoogleWindow } from "./types";
import { reloadPage } from "./utils";

vi.mock("next/script", () => ({
  default: ({ onLoad }: { onLoad?: () => void }) => (
    <button type="button" onClick={onLoad}>
      Load Google
    </button>
  ),
}));

vi.mock("./utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./utils")>();
  return { ...actual, reloadPage: vi.fn() };
});

const initialize = vi.fn();
const prompt = vi.fn();

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
    value: { accounts: { id: { initialize, prompt } } },
    configurable: true,
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete (window as GoogleWindow).google;
  initialize.mockReset();
  prompt.mockReset();
});

describe("GoogleOneTap", () => {
  it("prompts Google when the script loads", async () => {
    await start();

    expect(initialize).toHaveBeenCalledWith(expect.objectContaining({ client_id: "client-id" }));
    expect(prompt).toHaveBeenCalled();
  });

  it("exchanges the credential and reloads", async () => {
    const options = await start();
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));

    await act(async () => {
      await options.callback({ credential: "credential" });
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/google", expect.objectContaining({ method: "POST" }));
    expect(reloadPage).toHaveBeenCalled();
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

  it("renders nothing without a client id", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "");

    const { container } = render(<GoogleOneTap />);

    expect(container).toBeEmptyDOMElement();
  });
});
