"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_VISIBLE_MS = 420;

export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const firstPath = useRef(true);
  const running = useRef(false);
  const startedAt = useRef(0);
  const trickle = useRef<number | null>(null);
  const safety = useRef<number | null>(null);
  const hide = useRef<number | null>(null);
  const reset = useRef<number | null>(null);

  const finish = useCallback(() => {
    if (!running.current) return;
    running.current = false;

    if (trickle.current !== null) {
      window.clearInterval(trickle.current);
      trickle.current = null;
    }
    if (safety.current !== null) {
      window.clearTimeout(safety.current);
      safety.current = null;
    }
    if (reset.current !== null) {
      window.clearTimeout(reset.current);
      reset.current = null;
    }

    const elapsed = Date.now() - startedAt.current;
    const hold = Math.max(0, MIN_VISIBLE_MS - elapsed);

    setProgress(100);
    hide.current = window.setTimeout(() => {
      setVisible(false);
      reset.current = window.setTimeout(() => setProgress(0), 220);
    }, hold + 220);
  }, []);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;
    startedAt.current = Date.now();

    if (hide.current !== null) {
      window.clearTimeout(hide.current);
      hide.current = null;
    }
    if (reset.current !== null) {
      window.clearTimeout(reset.current);
      reset.current = null;
    }

    setVisible(true);
    setProgress(10);
    trickle.current = window.setInterval(() => {
      setProgress((value) => Math.min(90, value + Math.max(1, (90 - value) * 0.08)));
    }, 180);
    safety.current = window.setTimeout(finish, 10000);
  }, [finish]);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    finish();
  }, [pathname, finish]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;

      const next = new URL(href, window.location.href);
      if (
        next.pathname === window.location.pathname &&
        next.search === window.location.search
      ) {
        return;
      }

      start();
    };

    const onPopState = () => start();
    const onStart = () => start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("sunstrike:navigation-start", onStart);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("sunstrike:navigation-start", onStart);
    };
  }, [start]);

  useEffect(() => {
    return () => {
      if (trickle.current !== null) window.clearInterval(trickle.current);
      if (safety.current !== null) window.clearTimeout(safety.current);
      if (hide.current !== null) window.clearTimeout(hide.current);
      if (reset.current !== null) window.clearTimeout(reset.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-support transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
