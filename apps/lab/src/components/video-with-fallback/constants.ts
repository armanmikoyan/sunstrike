/**
 * The hero wall renders the same clip more than once (looped columns), so
 * every player of a given source is aligned to the first one that loads.
 * Without this the duplicate shows a different frame at the loop seam and the
 * wall visibly jumps.
 */
export const PLAYERS = new Map<string, HTMLVideoElement>();
