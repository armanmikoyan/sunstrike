import type { Transition } from "motion/react";

export const LAYOUT_SPRING: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
};

export const CONTENT_FADE: Transition = {
  duration: 0.24,
  ease: [0.32, 0.72, 0, 1],
};

export const INSTANT_TRANSITION: Transition = { duration: 0 };
