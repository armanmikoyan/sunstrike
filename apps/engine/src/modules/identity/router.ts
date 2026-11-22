import { Router } from "express";
import {
  completeOAuthSignIn,
  getSessionUser,
  refreshSession,
  signInWithGoogleIdToken,
  sendOtpCode,
  signOut,
  startAppleSignIn,
  startGithubSignIn,
  startGoogleSignIn,
  verifyOtpCode,
} from "./controller";

const router = Router();

router.post("/otp", sendOtpCode);
router.post("/verify", verifyOtpCode);
router.get("/session", getSessionUser);
router.post("/refresh", refreshSession);
router.post("/sign-out", signOut);
router.post("/google/token", signInWithGoogleIdToken);
router.post("/google", startGoogleSignIn);
router.post("/github", startGithubSignIn);
router.post("/apple", startAppleSignIn);
router.post("/callback", completeOAuthSignIn);

export default router;
