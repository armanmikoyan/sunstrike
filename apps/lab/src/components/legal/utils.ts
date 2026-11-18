import { ACTIVATION_OFFSET, MIN_GAP } from "./constants";

/**
 * Scroll positions at which each section becomes active. Positions are pushed
 * backwards until every item has at least `MIN_GAP` of scroll. The first item
 * always owns the top of the page.
 */
export function activationTargets(tops: number[], maxScroll: number, offset = ACTIVATION_OFFSET) {
  const targets = tops.map((top) => Math.max(0, top - offset));
  if (targets.length === 0) return targets;

  targets[0] = 0;

  const last = targets.length - 1;
  targets[last] = Math.min(targets[last], maxScroll);

  for (let index = last - 1; index >= 1; index -= 1) {
    targets[index] = Math.max(0, Math.min(targets[index], targets[index + 1] - MIN_GAP));
  }

  return targets;
}
