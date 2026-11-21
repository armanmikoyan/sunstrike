import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { REFRESH_COOKIE, REFRESH_MAX_AGE, SESSION_COOKIE, cookieOptions } from "./constants";
import { engineRequest } from "@/app/api/_engine";
import type { AuthSession, SessionTokens, SessionUser } from "./types";
import { sessionMaxAge } from "./utils";

export async function readSessionTokens(): Promise<SessionTokens> {
  const store = await cookies();

  return {
    accessToken: store.get(SESSION_COOKIE)?.value ?? null,
    refreshToken: store.get(REFRESH_COOKIE)?.value ?? null,
  };
}

export function requestSession(accessToken: string) {
  return engineRequest<{ user: SessionUser }>("/api/v1/identity/session", {
    token: accessToken,
  });
}

export function requestRefresh(refreshToken: string) {
  return engineRequest<AuthSession>("/api/v1/identity/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}

export function setSessionCookies(response: NextResponse, session: AuthSession): void {
  response.cookies.set(SESSION_COOKIE, session.accessToken, cookieOptions(sessionMaxAge(session.expiresAt)));
  response.cookies.set(REFRESH_COOKIE, session.refreshToken, cookieOptions(REFRESH_MAX_AGE));
}

export function clearSessionCookies(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  response.cookies.set(REFRESH_COOKIE, "", cookieOptions(0));
}
