import { NextResponse, type NextRequest } from "next/server";

const studios = new Set(["video", "image"]);

/**
 * Only two studios exist. Validating the segment here keeps an unknown mode a
 * real 404: the page-level `notFound()` runs inside the partially prerendered
 * shell, which has already committed a 200 response by the time it throws.
 */
export function proxy(request: NextRequest) {
  const [section, mode, ...rest] = request.nextUrl.pathname
    .split("/")
    .filter(Boolean);

  if (section !== "create" || rest.length > 0) return NextResponse.next();
  if (mode && studios.has(mode)) return NextResponse.next();

  return NextResponse.rewrite(new URL("/_not-found", request.url), {
    status: 404,
  });
}

export const config = {
  matcher: "/create/:path*",
};
