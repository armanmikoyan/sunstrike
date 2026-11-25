import { NextResponse, type NextRequest } from "next/server";
import { engineRequest, errorResponse } from "@/app/api/_engine";
import { ENGINE_QUOTE_PATH } from "@/app/api/pricing/constants";

export async function GET(request: NextRequest) {
  const result = await engineRequest<unknown>(`${ENGINE_QUOTE_PATH}${request.nextUrl.search}`);

  if (!result.ok) return errorResponse(result);

  return NextResponse.json(result.data);
}
