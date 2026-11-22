import { AUTH_COOKIE_PREFIX } from "@/app/api/auth/constants";
import type { OAuthProvider } from "./types";

export const OAUTH_COOKIE = `${AUTH_COOKIE_PREFIX}.oauth`;
export const OAUTH_MAX_AGE = 60 * 10;

export const OAUTH_PROVIDERS: OAuthProvider[] = ["google", "github", "apple"];
