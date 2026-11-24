import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  readSessionTokens,
  requestRefresh,
  requestSession,
  sessionResponse,
} from "@/app/api/auth/session";
import { errorResponse } from "@/app/api/_engine";

function noSession() {
  const response = NextResponse.json({ user: null });
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

  if (!refreshToken) return noSession();

  const refreshed = await requestRefresh(refreshToken);

  if (!refreshed.ok) {
    return refreshed.status === 401 ? noSession() : errorResponse(refreshed);
  }

  return sessionResponse(refreshed.data);
}
