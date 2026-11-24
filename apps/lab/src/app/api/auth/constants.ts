import type { OAuthProvider } from "./oauth/types";

export const AUTH_COOKIE_PREFIX = "auth";

export const SESSION_COOKIE = `${AUTH_COOKIE_PREFIX}.session`;
export const REFRESH_COOKIE = `${AUTH_COOKIE_PREFIX}.refresh`;

export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

const ENGINE_AUTH = "/api/v1/auth";

/** Engine endpoints behind the auth routes. */
export const ENGINE_AUTH_PATHS = {
  otp: `${ENGINE_AUTH}/otp`,
  verify: `${ENGINE_AUTH}/verify`,
  googleToken: `${ENGINE_AUTH}/google/token`,
  callback: `${ENGINE_AUTH}/callback`,
  session: `${ENGINE_AUTH}/session`,
  refresh: `${ENGINE_AUTH}/refresh`,
  signOut: `${ENGINE_AUTH}/sign-out`,
  oauth: {
    google: `${ENGINE_AUTH}/google`,
    github: `${ENGINE_AUTH}/github`,
  } satisfies Record<OAuthProvider, string>,
};
