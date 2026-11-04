/** Long enough to read as deliberate, short enough never to feel stuck. */
export const MIN_VISIBLE_MS = 420;

/** Fade-out and the pause before the bar resets to zero. */
export const FADE_MS = 220;

/** The safety valve: a navigation that never resolves still clears the bar. */
export const MAX_PROGRESS_MS = 10_000;

export const TRICKLE_MS = 180;
