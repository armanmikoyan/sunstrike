import { NextResponse } from "next/server";
import { engineRequest, errorResponse } from "@/app/api/_engine";
import { ENGINE_AUTH_PATHS } from "@/app/api/auth/constants";
import { sessionResponse } from "@/app/api/auth/session";
import type { AuthSession } from "@/app/api/auth/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: unknown; token?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!email || !token) {
    return NextResponse.json({ error: "An email and code are required." }, { status: 400 });
  }

  const result = await engineRequest<AuthSession>(ENGINE_AUTH_PATHS.verify, {
    method: "POST",
    body: { email, token },
  });

  if (!result.ok) return errorResponse(result);

  return sessionResponse(result.data);
}
