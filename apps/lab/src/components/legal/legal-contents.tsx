"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { legalCopy } from "./constants";
import type { LegalSection } from "./types";

/** A heading is active once it reaches the reading line under the nav. */
const activationOffset = 140;

/**
 * The shortest scroll distance an item gets. The final sections are often too
 * short to reach the reading line before the page ends, so the last item is
 * pinned to the bottom and the rail walks backwards from there. Without this,
 * one wheel step could skip several final sections.
 */
const minGap = 90;

/**
 * Scroll positions at which each section becomes active. Positions are pushed
 * backwards until every item has at least `minGap` of scroll. The first item
 * always owns the top of the page.
 */
export function activationTargets(
  tops: number[],
  maxScroll: number,
  offset = activationOffset,
) {
  const targets = tops.map((top) => Math.max(0, top - offset));
  if (targets.length === 0) return targets;

  targets[0] = 0;

  const last = targets.length - 1;
  targets[last] = Math.min(targets[last], maxScroll);

  for (let index = last - 1; index >= 1; index -= 1) {
    targets[index] = Math.max(
      0,
      Math.min(targets[index], targets[index + 1] - minGap),
    );
  }

  return targets;
}

const scrollKeys = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

export function LegalContents({
  sections,
  contactEmail,
}: {
  sections: Pick<LegalSection, "id" | "title">[];
  contactEmail: string;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  // A clicked item wins until the reader scrolls again. The final sections
  // cannot reach the reading line, so without this the spy would immediately
  // replace the click with the last item.
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

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const tops = elements.map(
        (element) => element.getBoundingClientRect().top + window.scrollY,
      );
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
      if (scrollKeys.has(event.key)) unlock();
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

  return (
    <aside className="hidden h-fit rounded-xl border border-white/[0.08] glass-card p-4 lg:sticky lg:top-16 lg:block">
      <p className="text-xs font-medium lg:text-[0.6875rem]">
        {legalCopy.contentsLabel}
      </p>
      <nav
        aria-label={legalCopy.contentsLabel}
        className="mt-3 flex flex-col gap-2"
      >
        {sections.map((section) => {
          const active = section.id === activeId;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={active ? "location" : undefined}
              onClick={() => {
                lockRef.current = true;
                setActiveId(section.id);
              }}
              className={cn(
                "-ml-2 border-l-2 py-0.5 pl-2 text-xs leading-snug transition-colors lg:text-[0.6875rem]",
                active
                  ? "border-white/30 font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {section.title}
            </a>
          );
        })}
      </nav>
      <div className="mt-4 border-t border-white/[0.06] pt-3 text-xs leading-relaxed text-muted-foreground lg:text-[0.6875rem]">
        <p>{legalCopy.contactNote}</p>
        <a
          href={`mailto:${contactEmail}`}
          className="mt-1 block text-foreground/70 transition-colors hover:text-foreground"
        >
          {contactEmail}
        </a>
      </div>
    </aside>
  );
}
