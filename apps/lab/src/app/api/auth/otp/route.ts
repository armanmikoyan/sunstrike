import { NextResponse } from "next/server";
import { engineRequest, errorResponse } from "@/app/api/_engine";
import type { OtpAccepted } from "@/app/api/auth/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json({ error: "An email is required." }, { status: 400 });
  }

  const result = await engineRequest<OtpAccepted>("/api/v1/auth/otp", {
    method: "POST",
    body: { email },
  });

  if (!result.ok) return errorResponse(result);

  return NextResponse.json({ ok: true }, { status: 202 });
}
