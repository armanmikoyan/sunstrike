import { requireAuth } from "./middleware";
import * as service from "./service";

/** Validate sessions, resolve identities and run email OTP / OAuth sign-in. */
export const identity = {
  requireAuth,
  verify: service.verify,
  resolve: service.resolve,
  sendOtpCode: service.sendOtpCode,
  verifyOtpCode: service.verifyOtpCode,
  getSessionUser: service.getSessionUser,
  refreshSession: service.refreshSession,
  signOut: service.signOut,
  startOAuthSignIn: service.startOAuthSignIn,
  completeOAuthSignIn: service.completeOAuthSignIn,
};

export type {
  AuthContext,
  AuthSession,
  AuthSubject,
  IdentityRecord,
  OAuthProvider,
  OAuthStart,
  SessionUser,
} from "./types";
