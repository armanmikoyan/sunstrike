"use client";

import { motion, useReducedMotion } from "motion/react";
import { contentFade, instantTransition } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? instantTransition : contentFade}
    >
      {children}
    </motion.div>
  );
}
