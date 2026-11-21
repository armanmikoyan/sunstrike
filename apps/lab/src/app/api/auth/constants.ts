export const SESSION_COOKIE = "session";
export const REFRESH_COOKIE = "refresh";

export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
