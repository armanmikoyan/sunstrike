import { NextResponse, type NextRequest } from "next/server";
import type { OAuthRouteContext } from "@/app/api/auth/oauth/types";
import { isOAuthProvider, startOAuth } from "@/app/api/auth/oauth/utils";

export async function POST(request: NextRequest, context: OAuthRouteContext) {
  const { provider } = await context.params;

  if (!isOAuthProvider(provider)) {
    return NextResponse.json({ error: "Unknown sign-in provider." }, { status: 404 });
  }

  return startOAuth(request, provider);
}
