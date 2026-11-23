import { requireAuth } from "./middleware";

/**
 * Authentication: verifies credentials and attaches the calling user to the
 * request. The sign-in flows themselves are served by this module's router.
 */
export const auth = { requireAuth };

export type { AuthContext, AuthSession, AuthSubject, OAuthProvider, OAuthStart, SessionUser } from "./types";
