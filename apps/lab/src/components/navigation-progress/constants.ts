/** Only show the bar if a navigation is slow enough to notice. */
export const SHOW_DELAY_MS = 120;

/** Brief hold at full width before the bar fades. */
export const HOLD_MS = 80;

export const FADE_MS = 150;

export const MAX_PROGRESS_MS = 10_000;

export const TRICKLE_MS = 180;

export const START_PROGRESS = 8;

/** A link or `router.push` caller started a navigation. */
export const NAVIGATION_START_EVENT = "wildscape:navigation-start";

/** A link's navigation finished (committed or was superseded). */
export const NAVIGATION_SETTLED_EVENT = "wildscape:navigation-settled";
