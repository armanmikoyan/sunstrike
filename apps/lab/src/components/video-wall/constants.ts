export const WALL_COLUMNS = [
  ["01", "02", "03"],
  ["04", "07", "08"],
  ["09", "11", "14"],
  ["16", "01", "03"],
  ["02", "09", "16"],
];

/** Five columns over a wall that never shrinks below 720px (`min-w-180`). */
export const WALL_TILE_SIZES = "(max-width: 720px) 144px, 20vw";

/** Wait for idle before mounting clips so posters own the first frame. */
export const WALL_IDLE_TIMEOUT_MS = 2000;

/** Fallback for browsers without requestIdleCallback. */
export const WALL_IDLE_FALLBACK_MS = 900;
