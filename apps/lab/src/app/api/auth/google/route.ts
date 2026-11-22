import { NextResponse } from "next/server";
import { engineRequest, errorResponse } from "@/app/api/_engine";
import { setSessionCookies } from "@/app/api/auth/session";
import type { AuthSession } from "@/app/api/auth/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { credential?: unknown } | null;
  const credential = typeof body?.credential === "string" ? body.credential : "";

  if (!credential) {
    return NextResponse.json({ error: "A Google credential is required." }, { status: 400 });
  }

  const result = await engineRequest<AuthSession>("/api/v1/identity/google/token", {
    method: "POST",
    body: { credential },
  });

  if (!result.ok) return errorResponse(result);

  const response = NextResponse.json({ user: result.data.user });
  setSessionCookies(response, result.data);

  return response;
}
