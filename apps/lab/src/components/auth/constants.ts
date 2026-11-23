export const GOOGLE_ONE_TAP_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export const SIGNING_OUT_EVENT = "auth:signing-out";
export const SIGNED_OUT_EVENT = "auth:signed-out";
export const SIGNED_IN_EVENT = "auth:signed-in";

export const AUTH_COPY = {
  signingOut: "Logging out…",
  signingOutDetail: "Closing your session.",
} as const;

/** Keep the sign-out overlay up at least this long so the action is visible. */
export const SIGN_OUT_MIN_MS = 800;

export const GOOGLE_ONE_TAP_OPTIONS = {
  auto_select: false,
  cancel_on_tap_outside: false,
  use_fedcm_for_prompt: true,
} as const;
