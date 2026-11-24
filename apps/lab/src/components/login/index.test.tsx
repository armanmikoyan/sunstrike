import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchMock, routerMock } from "~/vitest.setup";
import { navigate } from "@/components/auth/utils";
import { Login } from ".";
import { OAUTH_PROVIDERS } from "@/app/api/auth/oauth/constants";
import { loginCopy, RESEND_COOLDOWN_SECONDS, SENDING_PHASE_MS } from "./constants";

vi.mock("@/components/auth/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/auth/utils")>();
  return { ...actual, navigate: vi.fn() };
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function enterEmail(email = "arman@chronolab.ai") {
  await userEvent.type(screen.getByRole("textbox", { name: loginCopy.emailLabel }), email);
  await userEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) }));
}

async function enterCode(code = "123456") {
  await userEvent.click(await screen.findByRole("textbox", { name: "Digit 1 of 6" }, { timeout: 2000 }));
  await userEvent.keyboard(code);
}

describe("login", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with the email step", () => {
    render(<Login />);

    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: loginCopy.codeLabel })).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("••••••••")).not.toBeInTheDocument();
  });

  it("keeps both steps mounted so the column height never changes", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    render(<Login />);

    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: loginCopy.codeLabel, hidden: true })).toBeInTheDocument();

    await enterEmail();
    await screen.findByRole("textbox", { name: "Digit 1 of 6" }, { timeout: 2000 });

    // The email form stays in the DOM for its height, but leaves the
    // accessibility tree and the tab order.
    expect(screen.queryByRole("textbox", { name: loginCopy.emailLabel })).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel, hidden: true })).toBeInTheDocument();
  });

  it("disables send code until the email is valid", async () => {
    render(<Login />);
    const email = screen.getByRole("textbox", { name: loginCopy.emailLabel });
    const sendCode = () => screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) });

    expect(sendCode()).toBeDisabled();

    await userEvent.type(email, "asd@gmai..");
    expect(sendCode()).toBeDisabled();

    await userEvent.clear(email);
    await userEvent.type(email, "arman.mikoyan1@gmai");
    expect(sendCode()).toBeDisabled();

    await userEvent.clear(email);
    await userEvent.type(email, "asd@gmail.com");
    expect(sendCode()).toBeEnabled();
  });

  it("sends a code and moves to the code step", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    render(<Login />);

    await enterEmail();

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("/api/auth/otp", expect.objectContaining({ method: "POST" })),
    );
    expect(await screen.findByRole("textbox", { name: "Digit 1 of 6" }, { timeout: 2000 })).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("arman@chronolab.ai");
  });

  it("verifies the code and returns to the requested page", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));
    render(<Login next="/settings/account" />);

    await enterEmail();
    await enterCode();

    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith("/api/auth/verify", expect.objectContaining({ method: "POST" })),
    );
    expect(routerMock.replace).toHaveBeenCalledWith("/settings/account");
    expect(routerMock.refresh).toHaveBeenCalled();
  });

  it("rejects an off-site return path", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));
    render(<Login next="https://evil.example" />);

    await enterEmail();
    await enterCode();

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/"));
  });

  it("shows the engine message when sending a code fails", async () => {
    fetchMock.mockResolvedValueOnce(json({ error: "Too many attempts." }, 400));
    render(<Login />);

    await enterEmail();

    expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts.");
    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: loginCopy.codeLabel })).not.toBeInTheDocument();
  });

  it("replaces the Supabase cooldown sentence with friendly copy", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ error: "For security purposes, you can only request this after 24 seconds." }, 429),
    );
    render(<Login />);

    await enterEmail();

    expect(await screen.findByRole("status")).toHaveTextContent("Please wait 24s before requesting another code.");
    expect(screen.queryByText(/For security purposes/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel })).toBeInTheDocument();
  });

  it("reports the project-wide email cap without a false countdown", async () => {
    fetchMock.mockResolvedValueOnce(json({ error: "email rate limit exceeded" }, 429));
    render(<Login />);

    await enterEmail();

    const email = screen.getByRole("textbox", { name: loginCopy.emailLabel });
    const sendCode = () => screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) });

    expect(await screen.findByRole("alert")).toHaveTextContent(loginCopy.emailLimit);
    expect(screen.queryByText(loginCopy.cooldownBefore)).not.toBeInTheDocument();

    // Retrying the same address would spend another request and fail the same
    // way: the button stays off until the address itself changes.
    expect(sendCode()).toBeDisabled();

    await userEvent.clear(email);
    await userEvent.type(email, "other@chronolab.ai");

    expect(sendCode()).toBeEnabled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("turns a verify rate limit into friendly copy", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    fetchMock.mockResolvedValueOnce(
      json({ error: "For security purposes, you can only request this after 24 seconds." }, 429),
    );
    render(<Login />);

    await enterEmail();
    await enterCode();

    expect(await screen.findByRole("alert")).toHaveTextContent(loginCopy.verifyCooldown.replace("{seconds}", "24"));
  });

  it("returns to the email step on request", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    render(<Login />);

    await enterEmail();
    await userEvent.click(await screen.findByRole("button", { name: loginCopy.differentEmail }));

    const email = screen.getByRole("textbox", { name: loginCopy.emailLabel });

    expect(email).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: loginCopy.codeLabel })).not.toBeInTheDocument();

    // The caret lands in the field with the old address selected, so typing
    // replaces it instead of appending to it.
    await waitFor(() => expect(email).toHaveFocus());
    expect(email).toHaveValue("arman@chronolab.ai");
  });

  it("allows three sends before holding the resend for the wait", async () => {
    vi.useFakeTimers();

    fetchMock.mockResolvedValue(json({ ok: true }, 202));

    render(<Login />);

    fireEvent.change(screen.getByRole("textbox", { name: loginCopy.emailLabel }), {
      target: { value: "arman@chronolab.ai" },
    });
    fireEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) }));

    // Let the sending beat finish and the code step appear.
    act(() => vi.advanceTimersByTime(SENDING_PHASE_MS));

    const first = () => screen.getByRole("textbox", { name: "Digit 1 of 6" });
    const resend = () => screen.getByRole("button", { name: /Resend/ });

    expect(first()).toHaveFocus();

    // The first send does not start the wait: the resend is available at once.
    expect(resend()).toBeEnabled();
    expect(resend()).toHaveTextContent(loginCopy.resendCode);

    // Second send.
    fireEvent.change(first(), { target: { value: "1" } });
    fireEvent.click(resend());
    act(() => vi.advanceTimersByTime(SENDING_PHASE_MS));
    await act(async () => {});

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(first()).toHaveValue("");
    expect(resend()).toBeEnabled();
    expect(resend()).toHaveTextContent(loginCopy.resendCode);

    // Third send starts the wait.
    fireEvent.click(resend());
    act(() => vi.advanceTimersByTime(SENDING_PHASE_MS));
    await act(async () => {});

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(resend()).toBeDisabled();
    expect(resend()).toHaveTextContent(loginCopy.resendIn.replace("{seconds}", String(RESEND_COOLDOWN_SECONDS)));

    // Our own wait stays in the button: no explanation line competes with it.
    expect(screen.queryByText(/before requesting another code/)).not.toBeInTheDocument();

    for (let second = 0; second < RESEND_COOLDOWN_SECONDS; second += 1) {
      act(() => vi.advanceTimersByTime(1000));
    }

    // The burst's allowance is whole again.
    expect(resend()).toBeEnabled();
    expect(resend()).toHaveTextContent(loginCopy.resendCode);
  });

  it("explains a wait imposed by the server on the code step", async () => {
    vi.useFakeTimers();

    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    fetchMock.mockResolvedValueOnce(
      json({ error: "For security purposes, you can only request this after 24 seconds." }, 429),
    );

    render(<Login />);

    fireEvent.change(screen.getByRole("textbox", { name: loginCopy.emailLabel }), {
      target: { value: "arman@chronolab.ai" },
    });
    fireEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) }));
    act(() => vi.advanceTimersByTime(SENDING_PHASE_MS));

    fireEvent.click(screen.getByRole("button", { name: loginCopy.resendCode }));
    await act(async () => {});
    await act(async () => {});

    // The burst said this tap was free, so the refusal has to explain the
    // jump: the server's window replaces ours and the line says why.
    expect(screen.getByText(/before requesting another code/)).toHaveTextContent(
      "Please wait 24s before requesting another code.",
    );
    expect(screen.getByRole("button", { name: loginCopy.resendIn.replace("{seconds}", "24") })).toBeDisabled();
    expect(screen.queryByText(/For security purposes/)).not.toBeInTheDocument();
  });

  it("empties the boxes as soon as resend is tapped, before the reply", async () => {
    vi.useFakeTimers();

    fetchMock.mockResolvedValue(json({ ok: true }, 202));

    render(<Login />);

    fireEvent.change(screen.getByRole("textbox", { name: loginCopy.emailLabel }), {
      target: { value: "arman@chronolab.ai" },
    });
    fireEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) }));
    act(() => vi.advanceTimersByTime(SENDING_PHASE_MS));

    const first = () => screen.getByRole("textbox", { name: "Digit 1 of 6" });

    fireEvent.change(first(), { target: { value: "1" } });

    let reply!: (response: Response) => void;

    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          reply = resolve;
        }),
    );

    fireEvent.click(screen.getByRole("button", { name: loginCopy.resendCode }));

    // The tap is acknowledged at once: the old digits are gone and the button
    // is already busy, while the request is still open.
    expect(first()).toHaveValue("");
    expect(screen.getByRole("button", { name: loginCopy.sending })).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // The busy beat ends on its own clock, not the reply's: after the same
    // pause as the first send, the button is usable again even though the
    // request has not answered yet.
    act(() => vi.advanceTimersByTime(SENDING_PHASE_MS));

    expect(screen.getByRole("button", { name: loginCopy.resendCode })).toBeEnabled();
    expect(first()).toHaveFocus();

    await act(async () => {
      reply(json({ ok: true }, 202));
    });

    // The first resend leaves the burst open: no wait, caret at the start.
    expect(screen.getByRole("button", { name: loginCopy.resendCode })).toBeEnabled();
    expect(first()).toHaveFocus();
  });

  it("keeps the clicked provider loading and disables the other actions", async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    render(<Login />);

    const google = screen.getByRole("button", { name: new RegExp(loginCopy.google) });
    await userEvent.click(google);

    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel })).toBeDisabled();
    expect(google).toBeDisabled();
    expect(google).toHaveAttribute("aria-busy", "true");
    expect(google).toHaveTextContent(loginCopy.connecting);
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.github) })).toBeDisabled();
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) })).toBeDisabled();

    await act(async () => {
      resolveFetch(json({ url: "https://google.example/oauth" }));
    });

    expect(navigate).toHaveBeenCalledWith("https://google.example/oauth");
    expect(google).toBeDisabled();
    expect(google).toHaveTextContent(loginCopy.connecting);
  });

  it("keeps the sending state briefly, then reveals the code step before the request finishes", async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    render(<Login />);

    await userEvent.type(screen.getByRole("textbox", { name: loginCopy.emailLabel }), "arman@chronolab.ai");
    await userEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) }));

    const sending = screen.getByRole("button", { name: loginCopy.sending });
    expect(sending).toBeDisabled();
    expect(sending).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.google) })).toBeDisabled();
    expect(screen.queryByRole("group", { name: loginCopy.codeLabel })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    // The mail request is still unresolved when the phase ends.
    expect(await screen.findByRole("textbox", { name: "Digit 1 of 6" }, { timeout: 2000 })).toBeEnabled();
    expect(screen.queryByRole("button", { name: loginCopy.sending })).not.toBeInTheDocument();

    await act(async () => {
      resolveFetch(json({ ok: true }, 202));
    });

    expect(screen.getByRole("textbox", { name: "Digit 1 of 6" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("ignores a failed send after the user returns to the email step", async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    render(<Login />);

    await enterEmail();
    await userEvent.click(await screen.findByRole("button", { name: loginCopy.differentEmail }, { timeout: 2000 }));

    await act(async () => {
      resolveFetch(json({ error: "Too many attempts." }, 400));
    });

    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("submits automatically on the sixth digit and stays busy until it resolves", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    render(<Login />);

    await enterEmail();
    await enterCode();

    const code = screen.getByRole("textbox", { name: "Digit 1 of 6" });

    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith("/api/auth/verify", expect.objectContaining({ method: "POST" })),
    );
    expect(screen.queryByRole("button", { name: /verify code/i })).not.toBeInTheDocument();
    expect(code).toBeDisabled();
    expect(screen.getByRole("group", { name: loginCopy.codeLabel })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText(loginCopy.verifying)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: loginCopy.differentEmail })).toBeDisabled();

    await act(async () => {
      resolveFetch(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));
    });

    expect(routerMock.replace).toHaveBeenCalledWith("/");
    expect(code).toBeDisabled();
  });

  it("waits for all six digits before calling the API", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));
    render(<Login />);

    await enterEmail();
    await enterCode("12345");

    expect(fetchMock.mock.calls.some(([url]) => url === "/api/auth/verify")).toBe(false);

    await userEvent.keyboard("6");

    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith("/api/auth/verify", expect.objectContaining({ method: "POST" })),
    );
  });

  it("counts wrong codes and restarts from the email step after five", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));

    for (let attempt = 0; attempt < 5; attempt += 1) {
      fetchMock.mockResolvedValueOnce(json({ error: "Token has expired or is invalid" }, 403));
    }

    render(<Login />);

    await enterEmail();
    await enterCode();

    expect(await screen.findByText(loginCopy.wrongCode.replace("{remaining}", "4"))).toBeInTheDocument();

    // The caret lands on the last box so trimming starts where the code ends.
    expect(screen.getByRole("textbox", { name: "Digit 6 of 6" })).toHaveFocus();

    const retry = async (digit: string) => {
      await userEvent.click(screen.getByRole("textbox", { name: "Digit 1 of 6" }));
      await userEvent.keyboard(digit);
    };

    await retry("9");
    expect(await screen.findByText(loginCopy.wrongCode.replace("{remaining}", "3"))).toBeInTheDocument();

    await retry("8");
    expect(await screen.findByText(loginCopy.wrongCode.replace("{remaining}", "2"))).toBeInTheDocument();

    await retry("7");
    expect(await screen.findByText(loginCopy.wrongCodeLast)).toBeInTheDocument();

    await retry("6");
    expect(await screen.findByText(loginCopy.tooManyCodes)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: loginCopy.emailLabel })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: loginCopy.codeLabel })).not.toBeInTheDocument();
  });

  it("does not spend an attempt when the server errors", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    fetchMock.mockResolvedValueOnce(json({ error: "Something broke" }, 500));
    render(<Login />);

    await enterEmail();
    await enterCode();

    expect(await screen.findByText(loginCopy.unreachable)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Digit 1 of 6" })).toBeInTheDocument();
    expect(screen.queryByText(loginCopy.tooManyCodes)).not.toBeInTheDocument();
  });

  it.each(OAUTH_PROVIDERS)("starts %s sign-in and follows the returned URL", async (provider) => {
    const url = `https://${provider}.example/oauth`;
    fetchMock.mockResolvedValueOnce(json({ url }));
    render(<Login />);

    await userEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy[provider]) }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/auth/oauth/${provider}`,
        expect.objectContaining({ method: "POST" }),
      ),
    );
    expect(navigate).toHaveBeenCalledWith(url);
  });

  it("hides server configuration errors from the user", async () => {
    fetchMock.mockResolvedValueOnce(json({ error: "The engine is not configured." }, 503));
    render(<Login />);

    await enterEmail();

    expect(await screen.findByRole("alert")).toHaveTextContent(loginCopy.unreachable);
    expect(screen.getByRole("alert")).not.toHaveTextContent("engine");
  });

  it("shows the callback error passed by the server", async () => {
    render(<Login initialError="callback" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Sign-in could not be completed");
    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/login", { scroll: false }));
  });

  it("keeps the return path when clearing a callback error", async () => {
    render(<Login next="/library" initialError="callback" />);

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/login?next=%2Flibrary", { scroll: false }));
  });

  it("links terms and privacy to their pages", () => {
    render(<Login />);

    expect(screen.getByRole("link", { name: loginCopy.terms })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: loginCopy.privacy })).toHaveAttribute("href", "/privacy");
  });

  it("renders the inactive code step hidden on initial paint without flashing", () => {
    const { container } = render(<Login />);
    const codeForm = container.querySelector('form[aria-hidden="true"]');

    expect(codeForm).not.toBeNull();
    expect(codeForm).toHaveClass("opacity-0", "pointer-events-none");
  });
});
