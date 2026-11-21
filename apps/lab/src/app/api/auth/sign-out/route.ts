import { NextResponse } from "next/server";
import { engineRequest } from "@/app/api/_engine";
import { clearOAuthCookie } from "@/app/api/auth/oauth/cookies";
import { clearSessionCookies, readSessionTokens } from "@/app/api/auth/session";

export async function POST() {
  const { accessToken } = await readSessionTokens();

  if (accessToken) {
    await engineRequest("/api/v1/identity/sign-out", {
      method: "POST",
      token: accessToken,
    });
  }

  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response);
  clearOAuthCookie(response);

  return response;
}
