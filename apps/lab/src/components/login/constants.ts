import type { LoginErrors, LoginProvider } from "./types";
import type { Transition } from "motion/react";
import { mediaById } from "@/mocks/media";

export const loginThumbnailIds = ["02", "16", "11"];

/** The hero's three media cards, resolved once instead of on every render. */
export const loginThumbnails = loginThumbnailIds.map((id) => mediaById(id)).filter((item) => item !== undefined);

export const CODE_LENGTH = 6;

/** Wrong codes allowed before the sign-in restarts from the email step. */
export const MAX_CODE_ATTEMPTS = 5;

/** How long the sending state stays before the code step replaces it. */
export const SENDING_PHASE_MS = 700;

/**
 * Delay between neighbouring code boxes as the step appears. Six boxes at 60ms
 * settle within 0.4s: a visible ripple, still one gesture rather than six.
 */
export const CODE_BOX_STAGGER_MS = 60;

/**
 * How many codes one address may ask for in a row before the wait starts. The
 * initial send counts as the first, so the screen allows two instant resends.
 */
export const SENDS_BEFORE_WAIT = 3;

/**
 * The wait after that burst. Supabase's own per-address window must be at or
 * below this (or off) for the burst to reach the mailer at all.
 */
export const RESEND_COOLDOWN_SECONDS = 30;

/**
 * The two step forms crossfade while sliding a few pixels in the direction the
 * swap happens: the active step leaves to the right, the incoming one arrives
 * from the left, so the motion reads left-to-right and the reverse on the way
 * back. Short and front-loaded so the swap keeps pace with the tap.
 */
export const STEP_SWAP: Transition = { duration: 0.22, ease: [0.32, 0.72, 0, 1] };

/**
 * A code box arrives from below with a soft spring: enough travel to read as
 * motion, enough damping to settle without wobbling. The stagger turns the six
 * into a left-to-right ripple instead of one block fading in.
 */
export const CODE_ENTRANCE: Transition = { type: "spring", stiffness: 240, damping: 22, mass: 0.9 };

/** Digit and state changes: quick, with a hint of overshoot. */
export const CODE_DIGIT: Transition = { type: "spring", stiffness: 460, damping: 28, mass: 0.7 };

/** A box before it lands, and the pose it settles into. */
export const CODE_BOX_HIDDEN = { opacity: 0, y: 16, scale: 0.84 };
export const CODE_BOX_SHOWN = { opacity: 1, y: 0, scale: 1 };

/** Idle box, a box with a digit, the box under the caret, and a verifying one. */
export const CODE_EMPTY_TONE = {
  borderColor: "rgba(167, 139, 250, 0.24)",
  backgroundColor: "rgba(139, 92, 246, 0.06)",
  boxShadow: "0 0 0 rgba(139, 92, 246, 0)",
};

export const CODE_FILLED_TONE = {
  borderColor: "rgba(139, 92, 246, 0.6)",
  backgroundColor: "rgba(139, 92, 246, 0.13)",
  boxShadow: "0 0 18px rgba(139, 92, 246, 0.18)",
};

export const CODE_FOCUSED_TONE = {
  borderColor: "rgba(196, 181, 253, 0.85)",
  backgroundColor: "rgba(139, 92, 246, 0.12)",
  boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.18)",
};

export const CODE_BUSY_TONE = {
  borderColor: "rgba(167, 139, 250, 0.85)",
  backgroundColor: "rgba(139, 92, 246, 0.2)",
  boxShadow: "0 0 22px rgba(139, 92, 246, 0.3)",
};

export const loginProviders: LoginProvider[] = ["google", "github"];

export const loginHeroId = "09";

export const loginErrors: LoginErrors = {
  callback: "Sign-in could not be completed. Try again.",
};

export const loginCopy = {
  brand: "Chronolab.ai",
  heroTitleBefore: "A studio for",
  heroTitleAccent: "directed frames",
  heroDescription: "Image and motion generation with real direction. No subscription, just pay for the work you make.",
  motion: "Motion 2",
  upscale: "4K upscale",
  copyright: "© 2026 Chronolab.ai · Pay as you go",
  backToStudio: "Back to studio",
  title: "Sign in to Chronolab",
  emailLabel: "Email",
  emailPlaceholder: "you@studio.com",
  codeLabel: "Code",
  sendCode: "Send code",
  sending: "Sending…",
  resendCode: "Resend code",
  resendIn: "Resend in {seconds}s",
  cooldownBefore: "Please wait ",
  cooldownAfter: " before requesting another code.",
  verifyCooldown: "Too many attempts. Try again in {seconds}s.",
  emailLimit: "Email limit reached. Try again later.",
  verifying: "Verifying…",
  connecting: "Connecting…",
  differentEmail: "Use a different email",
  codeSentBefore: "We sent a code to ",
  wrongCode: "That code is incorrect. {remaining} attempts left.",
  wrongCodeLast: "That code is incorrect. 1 attempt left.",
  tooManyCodes: "Too many incorrect codes. Choose how you want to sign in.",
  or: "or",
  google: "Continue with Google",
  github: "Continue with GitHub",
  termsBefore: "By continuing you agree to our ",
  terms: "Terms",
  termsAnd: " and ",
  privacy: "Privacy Policy",
  termsAfter: ".",
  footer: "Pay as you go · balance never expires",
  unreachable: "Could not reach the server. Try again.",
};
