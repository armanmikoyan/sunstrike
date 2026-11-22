import { NextResponse } from "next/server";
import { engineRequest, errorResponse } from "@/app/api/_engine";
import { setSessionCookies } from "@/app/api/auth/session";
import type { AuthSession } from "@/app/api/auth/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { credential?: unknown; nonce?: unknown } | null;
  const credential = typeof body?.credential === "string" ? body.credential : "";
  const nonce = typeof body?.nonce === "string" ? body.nonce : "";

  if (!credential || !nonce) {
    return NextResponse.json({ error: "A Google credential and nonce are required." }, { status: 400 });
  }

  const result = await engineRequest<AuthSession>("/api/v1/identity/google/token", {
    method: "POST",
    body: { credential, nonce },
  });

  if (!result.ok) return errorResponse(result);

  const response = NextResponse.json({ user: result.data.user });
  setSessionCookies(response, result.data);

  return response;
}
