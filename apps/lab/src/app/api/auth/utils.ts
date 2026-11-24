export function sessionMaxAge(expiresAt: number, now = Date.now()): number {
  return Math.max(0, expiresAt - Math.floor(now / 1000));
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/** A same-origin path to return to after sign-in, or the home page. */
export function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";

  return value;
}
