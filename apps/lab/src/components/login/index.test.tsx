import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fetchMock, routerMock } from "~/vitest.setup";
import { navigate } from "@/components/auth/utils";
import { Login } from ".";
import { loginCopy, loginProviders } from "./constants";

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
  await userEvent.type(screen.getByLabelText(loginCopy.emailLabel), email);
  await userEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) }));
}

describe("login", () => {
  it("starts with the email step", () => {
    render(<Login />);

    expect(screen.getByLabelText(loginCopy.emailLabel)).toBeInTheDocument();
    expect(screen.queryByLabelText(loginCopy.codeLabel)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("••••••••")).not.toBeInTheDocument();
  });

  it("disables send code until the email is valid", async () => {
    render(<Login />);
    const email = screen.getByLabelText(loginCopy.emailLabel);
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
    expect(await screen.findByLabelText(loginCopy.codeLabel)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("arman@chronolab.ai");
  });

  it("verifies the code and returns to the requested page", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    fetchMock.mockResolvedValueOnce(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));
    render(<Login next="/settings/account" />);

    await enterEmail();
    await userEvent.type(await screen.findByLabelText(loginCopy.codeLabel), "123456");
    await userEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy.verifyCode) }));

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
    await userEvent.type(await screen.findByLabelText(loginCopy.codeLabel), "123456");
    await userEvent.click(screen.getByRole("button", { name: new RegExp(loginCopy.verifyCode) }));

    await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/"));
  });

  it("shows the engine message when sending a code fails", async () => {
    fetchMock.mockResolvedValueOnce(json({ error: "Too many attempts." }, 429));
    render(<Login />);

    await enterEmail();

    expect(await screen.findByRole("alert")).toHaveTextContent("Too many attempts.");
  });

  it("returns to the email step on request", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true }, 202));
    render(<Login />);

    await enterEmail();
    await userEvent.click(await screen.findByRole("button", { name: loginCopy.differentEmail }));

    expect(screen.getByLabelText(loginCopy.emailLabel)).toBeInTheDocument();
    expect(screen.queryByLabelText(loginCopy.codeLabel)).not.toBeInTheDocument();
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

    expect(screen.getByLabelText(loginCopy.emailLabel)).toBeDisabled();
    expect(google).toBeDisabled();
    expect(google).toHaveAttribute("aria-busy", "true");
    expect(google).toHaveTextContent(loginCopy.connecting);
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.github) })).toBeDisabled();
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.apple) })).toBeDisabled();
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) })).toBeDisabled();

    await act(async () => {
      resolveFetch(json({ url: "https://google.example/oauth" }));
    });

    expect(navigate).toHaveBeenCalledWith("https://google.example/oauth");
    expect(google).toBeDisabled();
    expect(google).toHaveTextContent(loginCopy.connecting);
  });

  it("keeps send code loading and disables the other actions", async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    render(<Login />);

    await userEvent.type(screen.getByLabelText(loginCopy.emailLabel), "arman@chronolab.ai");
    const email = screen.getByLabelText(loginCopy.emailLabel);
    const send = screen.getByRole("button", { name: new RegExp(loginCopy.sendCode) });
    await userEvent.click(send);

    expect(email).toBeDisabled();
    expect(send).toBeDisabled();
    expect(send).toHaveAttribute("aria-busy", "true");
    expect(send).toHaveTextContent(loginCopy.sending);
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.google) })).toBeDisabled();
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.github) })).toBeDisabled();
    expect(screen.getByRole("button", { name: new RegExp(loginCopy.apple) })).toBeDisabled();

    await act(async () => {
      resolveFetch(json({ ok: true }, 202));
    });

    expect(await screen.findByLabelText(loginCopy.codeLabel)).toBeInTheDocument();
  });

  it("keeps verify loading after a successful exchange", async () => {
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
    await userEvent.type(await screen.findByLabelText(loginCopy.codeLabel), "123456");
    const code = screen.getByLabelText(loginCopy.codeLabel);
    const verify = screen.getByRole("button", { name: new RegExp(loginCopy.verifyCode) });
    await userEvent.click(verify);

    expect(code).toBeDisabled();
    expect(verify).toBeDisabled();
    expect(verify).toHaveAttribute("aria-busy", "true");
    expect(verify).toHaveTextContent(loginCopy.verifying);
    expect(screen.getByRole("button", { name: loginCopy.differentEmail })).toBeDisabled();

    await act(async () => {
      resolveFetch(json({ user: { id: "user-1", email: "arman@chronolab.ai" } }));
    });

    expect(routerMock.replace).toHaveBeenCalledWith("/");
    expect(verify).toBeDisabled();
    expect(verify).toHaveTextContent(loginCopy.verifying);
  });

  it.each(loginProviders)("starts %s sign-in and follows the returned URL", async (provider) => {
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
});
