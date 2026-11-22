import type { AuthProvider, ErrorMessageBody, OAuthStartResult, OAuthUrlResponse } from "./types";

export function safeNext(value: string | null | undefined): string {
  if (!value) return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";

  return value;
}

export async function readMessage(
  response: Response,
  fallback = "The request could not be completed.",
): Promise<string> {
  if (response.status >= 500) return fallback;

  try {
    const body = (await response.json()) as ErrorMessageBody;

    if (typeof body.error === "string" && body.error) return body.error;
  } catch {
    return fallback;
  }

  return fallback;
}

export function navigate(url: string): void {
  window.location.assign(url);
}

export function reloadPage(): void {
  window.location.reload();
}

export async function startOAuthSignIn(
  provider: AuthProvider,
  next: string,
  fallback: string,
): Promise<OAuthStartResult> {
  try {
    const response = await fetch(`/api/auth/oauth/${provider}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ next }),
    });

    if (!response.ok) return { ok: false, error: await readMessage(response, fallback) };

    const body = (await response.json()) as OAuthUrlResponse;

    if (typeof body.url !== "string" || !body.url) return { ok: false, error: fallback };

    return { ok: true, url: body.url };
  } catch {
    return { ok: false, error: fallback };
  }
}
