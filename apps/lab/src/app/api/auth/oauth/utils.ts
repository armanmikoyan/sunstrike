import { NextResponse, type NextRequest } from "next/server";
import { engineRequest, errorResponse } from "@/app/api/_engine";
import { safeNext, setOAuthCookie } from "./cookies";
import { OAUTH_PROVIDERS } from "./constants";
import type { OAuthProvider, OAuthStart } from "./types";

export function isOAuthProvider(value: string): value is OAuthProvider {
  return OAUTH_PROVIDERS.includes(value as OAuthProvider);
}

export async function startOAuth(request: NextRequest, provider: OAuthProvider) {
  const body = (await request.json().catch(() => ({}))) as { next?: unknown } | null;
  const next = safeNext(body?.next);
  const redirectTo = `${request.nextUrl.origin}/api/auth/callback`;

  const result = await engineRequest<OAuthStart>(`/api/v1/identity/${provider}`, {
    method: "POST",
    body: { redirectTo },
  });

  if (!result.ok) return errorResponse(result);

  const response = NextResponse.json({ url: result.data.url });
  setOAuthCookie(response, {
    codeVerifier: result.data.codeVerifier,
    flowId: result.data.flowId,
    next,
  });

  return response;
}
