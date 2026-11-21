import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  readSessionTokens,
  requestRefresh,
  requestSession,
  setSessionCookies,
} from "@/app/api/auth/session";
import { errorResponse } from "@/app/api/_engine";

function unauthorized() {
  const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  clearSessionCookies(response);

  return response;
}

export async function GET() {
  const { accessToken, refreshToken } = await readSessionTokens();

  if (accessToken) {
    const current = await requestSession(accessToken);

    if (current.ok) return NextResponse.json({ user: current.data.user });

    if (current.status !== 401) return errorResponse(current);
  }

  if (!refreshToken) return unauthorized();

  const refreshed = await requestRefresh(refreshToken);

  if (!refreshed.ok) {
    return refreshed.status === 401 ? unauthorized() : errorResponse(refreshed);
  }

  const response = NextResponse.json({ user: refreshed.data.user });
  setSessionCookies(response, refreshed.data);

  return response;
}
