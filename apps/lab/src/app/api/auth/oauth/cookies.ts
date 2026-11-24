import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { cookieOptions, safeNext } from "@/app/api/auth/utils";
import { OAUTH_COOKIE, OAUTH_MAX_AGE } from "./constants";
import type { OAuthCookie } from "./types";

function parseOAuthCookie(value: string | undefined): OAuthCookie | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);

    if (typeof parsed !== "object" || parsed === null) return null;

    const { codeVerifier, flowId, next } = parsed as Record<string, unknown>;

    if (typeof codeVerifier !== "string" || !codeVerifier) return null;

    return {
      codeVerifier,
      flowId: typeof flowId === "string" ? flowId : null,
      next: safeNext(next),
    };
  } catch {
    return null;
  }
}

export async function readOAuthCookie(): Promise<OAuthCookie | null> {
  const store = await cookies();

  return parseOAuthCookie(store.get(OAUTH_COOKIE)?.value);
}

export function setOAuthCookie(response: NextResponse, oauth: OAuthCookie): void {
  response.cookies.set(OAUTH_COOKIE, JSON.stringify(oauth), cookieOptions(OAUTH_MAX_AGE));
}

export function clearOAuthCookie(response: NextResponse): void {
  response.cookies.set(OAUTH_COOKIE, "", cookieOptions(0));
}
