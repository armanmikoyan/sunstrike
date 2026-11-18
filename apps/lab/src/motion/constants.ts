import type { Transition } from "motion/react";

/** Critically damped spring used for layout/size changes. */
export const LAYOUT_SPRING: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
};

/** Content fade/slide paired with a layout change. */
export const CONTENT_FADE: Transition = {
  duration: 0.24,
  ease: [0.32, 0.72, 0, 1],
};

/** Immediate transition for reduced-motion users. */
export const INSTANT_TRANSITION: Transition = { duration: 0 };
