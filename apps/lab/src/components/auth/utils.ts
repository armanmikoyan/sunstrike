import type { ErrorMessageBody } from "./types";

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
