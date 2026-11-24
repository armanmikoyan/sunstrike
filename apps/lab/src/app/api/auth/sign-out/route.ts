import { NextResponse } from "next/server";
import { engineRequest } from "@/app/api/_engine";
import { ENGINE_AUTH_PATHS } from "@/app/api/auth/constants";
import { clearOAuthCookie } from "@/app/api/auth/oauth/cookies";
import { clearSessionCookies, readSessionTokens } from "@/app/api/auth/session";

export async function POST() {
  const { accessToken } = await readSessionTokens();

  if (accessToken) {
    await engineRequest(ENGINE_AUTH_PATHS.signOut, {
      method: "POST",
      token: accessToken,
    });
  }

  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response);
  clearOAuthCookie(response);

  return response;
}
