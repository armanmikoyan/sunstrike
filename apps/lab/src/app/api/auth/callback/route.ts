import { NextResponse, type NextRequest } from "next/server";
import { engineRequest } from "@/app/api/_engine";
import { clearOAuthCookie, readOAuthCookie } from "@/app/api/auth/oauth/cookies";
import { setSessionCookies } from "@/app/api/auth/session";
import type { AuthSession } from "@/app/api/auth/types";

function redirectToLogin(request: NextRequest, error: string) {
  const response = NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  clearOAuthCookie(response);

  return response;
}

export async function GET(request: NextRequest) {
  const oauth = await readOAuthCookie();
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !oauth) return redirectToLogin(request, "callback");
  if (!code) return redirectToLogin(request, "callback");

  const result = await engineRequest<AuthSession>("/api/v1/identity/callback", {
    method: "POST",
    body: {
      code,
      codeVerifier: oauth.codeVerifier,
      flowId: oauth.flowId,
    },
  });

  if (!result.ok) return redirectToLogin(request, "callback");

  const response = NextResponse.redirect(new URL(oauth.next, request.url));
  setSessionCookies(response, result.data);
  clearOAuthCookie(response);

  return response;
}
