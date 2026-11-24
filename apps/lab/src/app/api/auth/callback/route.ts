import { NextResponse, type NextRequest } from "next/server";
import { engineRequest } from "@/app/api/_engine";
import { ENGINE_AUTH_PATHS } from "@/app/api/auth/constants";
import { clearOAuthCookie, readOAuthCookie } from "@/app/api/auth/oauth/cookies";
import { setSessionCookies } from "@/app/api/auth/session";
import type { AuthSession } from "@/app/api/auth/types";

function redirectToLogin(request: NextRequest, error: string, next?: string) {
  const login = new URL("/login", request.url);
  login.searchParams.set("error", error);
  if (next) login.searchParams.set("next", next);

  const response = NextResponse.redirect(login);
  clearOAuthCookie(response);

  return response;
}

export async function GET(request: NextRequest) {
  const oauth = await readOAuthCookie();
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !oauth) return redirectToLogin(request, "callback", oauth?.next);
  if (!code) return redirectToLogin(request, "callback", oauth.next);

  const result = await engineRequest<AuthSession>(ENGINE_AUTH_PATHS.callback, {
    method: "POST",
    body: {
      code,
      codeVerifier: oauth.codeVerifier,
      flowId: oauth.flowId,
    },
  });

  if (!result.ok) return redirectToLogin(request, "callback", oauth.next);

  const response = NextResponse.redirect(new URL(oauth.next, request.url));
  setSessionCookies(response, result.data);
  clearOAuthCookie(response);

  return response;
}
