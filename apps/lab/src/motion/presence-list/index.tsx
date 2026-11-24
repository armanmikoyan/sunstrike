"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { INSTANT_TRANSITION, LAYOUT_SPRING } from "@/motion/constants";
import { ITEM_HIDDEN, ITEM_SHOWN } from "./constants";
import type { PresenceListProps } from "./types";

export function PresenceList<T extends { id: string }>({ items, children, itemClassName }: PresenceListProps<T>) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          initial={ITEM_HIDDEN}
          animate={ITEM_SHOWN}
          exit={ITEM_HIDDEN}
          transition={reduceMotion ? INSTANT_TRANSITION : LAYOUT_SPRING}
          className={itemClassName}
        >
          {children(item)}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
