import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE, SESSION_COOKIE } from "@/app/api/auth/constants";

const studios = new Set(["video", "image"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/settings")) {
    if (!request.cookies.get(SESSION_COOKIE) && !request.cookies.get(REFRESH_COOKIE)) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", `${pathname}${search}`);

      return NextResponse.redirect(login);
    }

    return NextResponse.next();
  }

  const [section, mode, ...rest] = pathname.split("/").filter(Boolean);

  if (section !== "create" || rest.length > 0) return NextResponse.next();
  if (mode && studios.has(mode)) return NextResponse.next();

  return NextResponse.rewrite(new URL("/_not-found", request.url), {
    status: 404,
  });
}

export const config = {
  matcher: ["/create/:path*", "/settings/:path*"],
};
