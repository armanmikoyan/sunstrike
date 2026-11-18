"use client";

import { useEffect, useRef, useState } from "react";
import { SCROLL_KEYS } from "./constants";
import type { ContentsSection } from "./types";
import { activationTargets } from "./utils";

/**
 * Scroll spy for the contents rail. A clicked item wins until the reader
 * scrolls again: the final sections cannot reach the reading line, so without
 * the lock the spy would immediately replace the click with the last item.
 */
export function useActiveSection(sections: ContentsSection[]) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const lockRef = useRef(false);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      if (lockRef.current) return;

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const tops = elements.map((element) => element.getBoundingClientRect().top + window.scrollY);
      const targets = activationTargets(tops, maxScroll);
      const y = window.scrollY;

      let next = elements[0].id;
      for (let index = 0; index < targets.length; index += 1) {
        if (targets[index] <= y) next = elements[index].id;
      }

      setActiveId(next);
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    const unlock = () => {
      if (!lockRef.current) return;
      lockRef.current = false;
      schedule();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) unlock();
    };

    // The first read waits a frame so the browser has finished laying out
    // (and applying any hash jump) before positions are measured.
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("wheel", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", unlock);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", unlock);
    };
  }, [sections]);

  const select = (id: string) => {
    lockRef.current = true;
    setActiveId(id);
  };

  return { activeId, select };
}
