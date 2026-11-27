/** Routes a visitor is most likely to open next, warmed once the app is idle. */
export const WARM_ROUTES = ["/create/video", "/create/image", "/pricing", "/library", "/explore"] as const;

/** Give the current page time to finish its own work before warming. */
export const WARM_TIMEOUT_MS = 2500;

/** Fallback for browsers without requestIdleCallback. */
export const WARM_FALLBACK_MS = 1200;
