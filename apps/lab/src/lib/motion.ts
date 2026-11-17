import type { Transition } from "motion/react";

/** Critically damped spring used for layout/size changes. */
export const layoutSpring: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
};

/** Content fade/slide paired with a layout change. */
export const contentFade: Transition = {
  duration: 0.24,
  ease: [0.32, 0.72, 0, 1],
};

/** Immediate transition for reduced-motion users. */
export const instantTransition: Transition = { duration: 0 };
