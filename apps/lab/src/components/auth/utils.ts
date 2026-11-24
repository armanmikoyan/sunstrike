import type { OAuthProvider } from "@/app/api/auth/oauth/types";
import { GOOGLE_ONE_TAP_OPTIONS } from "./constants";
import type {
  ErrorMessageBody,
  GoogleAccountsId,
  GoogleCredentialResponse,
  GoogleNonce,
  OAuthStartResult,
  OAuthUrlResponse,
} from "./types";

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
  provider: OAuthProvider,
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

export async function signInWithGoogleCredential(credential: string, nonce: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ credential, nonce }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function startGoogleOneTap(
  googleId: GoogleAccountsId,
  clientId: string,
  onSuccess: () => void,
): Promise<void> {
  try {
    const { nonce, hashedNonce } = await createGoogleNonce();

    googleId.initialize({
      ...GOOGLE_ONE_TAP_OPTIONS,
      client_id: clientId,
      callback: async (response: GoogleCredentialResponse) => {
        if (!response.credential) return;
        if (await signInWithGoogleCredential(response.credential, nonce)) onSuccess();
      },
      nonce: hashedNonce,
    });

    googleId.prompt();
  } catch {
    return;
  }
}

export function supportsGoogleOneTap(): boolean {
  return (
    window.isSecureContext !== false &&
    typeof globalThis.crypto?.subtle?.digest === "function" &&
    typeof globalThis.crypto?.getRandomValues === "function"
  );
}

export async function createGoogleNonce(): Promise<GoogleNonce> {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(nonce));
  const hashedNonce = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return { nonce, hashedNonce };
}
