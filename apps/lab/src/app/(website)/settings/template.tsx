"use client";

import { motion, useReducedMotion } from "motion/react";
import { CONTENT_FADE, INSTANT_TRANSITION } from "@/motion/constants";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? INSTANT_TRANSITION : CONTENT_FADE}
    >
      {children}
    </motion.div>
  );
}
